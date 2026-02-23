pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        GITLEAKS_VERSION = '8.24.3'
        IMAGE_NAME = 'streamgen-ai'
        IMAGE_TAG = 'latest'
        DOCKERHUB_REPO = ''
        DOCKER_AVAILABLE = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short=7 HEAD', returnStdout: true).trim()
                    env.DOCKER_AVAILABLE = sh(script: 'command -v docker >/dev/null 2>&1 && echo true || echo false', returnStdout: true).trim()
                    echo "Docker available on this agent: ${env.DOCKER_AVAILABLE}"
                }
            }
        }

        stage('Validate Prometheus Config') {
            when {
                expression { env.DOCKER_AVAILABLE == 'true' }
            }
            steps {
                sh '''
                    docker run --rm \
                      -v "${WORKSPACE}/monitoring:/etc/prometheus:ro" \
                      prom/prometheus:v2.53.3 \
                      promtool check config /etc/prometheus/prometheus.yml
                '''
            }
        }

        stage('Secret Scan (Gitleaks)') {
            steps {
                sh '''
                    curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -o gitleaks.tar.gz
                    tar -xzf gitleaks.tar.gz gitleaks
                    ./gitleaks version
                    ./gitleaks detect --source . -v --config .gitleaks.toml --redact --exit-code 2 --log-opts="HEAD~1..HEAD"
                    ./gitleaks detect --source . --config .gitleaks.toml --no-git --redact --exit-code 2
                '''
            }
        }

        stage('Unit Testing') {
            agent {
                docker {
                image 'node:20-alpine'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build & Test') {
            agent {
                docker {
                image 'node:20-alpine'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run build'
            }
        }

        stage('Dependency Security Scan') {
            agent {
                docker {
                image 'node:20-alpine'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm audit --audit-level=high'
                script {
                    if (env.DOCKER_AVAILABLE == 'true') {
                        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                            sh '''
                                docker run --rm \
                                  -e SNYK_TOKEN \
                                  -v "${WORKSPACE}:/project" \
                                  -w /project \
                                  snyk/snyk:node test --severity-threshold=medium
                            '''
                        }
                    } else {
                        echo 'Skipping Snyk dependency scan because Docker is not available on this agent.'
                    }
                }
            }
        }

        stage('Docker Build & Security Scan') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
                sh 'docker save ${IMAGE_NAME}:${IMAGE_TAG} -o ${IMAGE_NAME}.tar'
                sh """
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy image \
                --severity CRITICAL,HIGH \
                --exit-code 1 \
                ${IMAGE_NAME}:${IMAGE_TAG}
                """
                // withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                //     sh '''
                //         docker run --rm \
                //           -e SNYK_TOKEN \
                //           -v /var/run/docker.sock:/var/run/docker.sock \
                //           snyk/snyk:docker container test ${IMAGE_NAME}:${IMAGE_TAG} --severity-threshold=medium
                //     '''
                // }
            }
        }

       stage('OWASP ZAP DAST Scan') {
            steps {
                sh '''
                    docker run -d --name app -p 3000:80 ${IMAGE_NAME}:${IMAGE_TAG}

                    for i in $(seq 1 60); do
                    if curl -sf http://10.10.1.94:3000 >/dev/null 2>&1; then
                        echo "App is ready"
                        break
                    fi
                    echo "Attempt ${i}: application not ready"
                    sleep 2
                    done

                    docker run --rm --network host \
                    --user root \
                    -v "${WORKSPACE}:/zap/wrk/:rw" \
                    ghcr.io/zaproxy/zaproxy:stable \
                    zap-baseline.py \
                    -t http://10.10.1.94:3000 \
                    -I \
                    -J report_json.json \
                    -w report_md.md \
                    -r report_html.html
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: '*.html, *.json, *.md', fingerprint: true
                    sh 'docker rm -f app || true'
                }
            }
        }
       stage('Terraform Security Scan (Trivy)') {
            steps {
                sh '''
                    docker run --rm \
                    -v "${WORKSPACE}:/workspace" \
                    -w /workspace \
                    aquasec/trivy config \
                    --severity CRITICAL,HIGH,MEDIUM \
                    --exit-code 1 \
                    terraform
                '''
            }
        }

        stage('Deploy to Docker Hub') {
            when {
                allOf {
                    branch 'main'
                    expression { env.DOCKER_AVAILABLE == 'true' }
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
                        echo "DOCKERHUB_REPO=${DOCKER_USERNAME}/${IMAGE_NAME}" > .image_meta
                    '''
                }
                script {
                    env.DOCKERHUB_REPO = sh(script: "awk -F= '/DOCKERHUB_REPO/ {print \$2}' .image_meta", returnStdout: true).trim()
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            when {
                allOf {
                    branch 'main'
                    expression { env.DOCKER_AVAILABLE == 'true' }
                }
            }
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        if [ -z "${DOCKERHUB_REPO}" ]; then
                          echo "DOCKERHUB_REPO not found; skipping manifest update"
                          exit 1
                        fi

                        NEW_IMAGE="${DOCKERHUB_REPO}:${IMAGE_TAG}"
                        sed -i "s|image: .*|image: ${NEW_IMAGE}|g" kubernetes/deployment.yaml

                        git config user.name "jenkins"
                        git config user.email "jenkins@local"
                        git add kubernetes/deployment.yaml
                        git commit -m "Update Kubernetes deployment with new image tag: ${IMAGE_TAG}" || true

                        REPO_URL=$(git config --get remote.origin.url | sed 's#https://##')
                        git push "https://${GITHUB_TOKEN}@${REPO_URL}" HEAD:main
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker rm -f app >/dev/null 2>&1 || true'
            sh 'rm -f .image_meta'
            echo 'Pipeline Completed.'
        }
    }
}
