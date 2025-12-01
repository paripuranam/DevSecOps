pipeline {
    agent any

    tools { nodejs 'node20' }

    stages {
        stage('Unit Testing') {
            steps {
                checkout scm
                sh 'npm ci && npm test'
            }
        }

        stage('Build & Test') {
            steps {
                checkout scm
                sh 'npm ci && npm run lint || true && npm run build'
            }
        }

        stage('Dependency Security Scan') {
            steps {
                sh 'npm ci && npm audit --audit-level=high || true'
            }
        }

        stage('Docker Build & Scan') {
            steps {
                script {
                    def image = docker.build("streamgen-ai:latest", ".")

                    docker.image('aquasec/trivy:latest').inside {
                        sh "trivy image --severity CRITICAL,HIGH --exit-code 0 streamgen-ai:latest"
                    }

                    echo "Docker image built and scanned: streamgen-ai:latest"
                }
            }
        }

        stage('Deploy to Docker Hub') {
            when { branch 'main' }
            steps {
                script {
                    docker.withRegistry('', 'docker-credentials-id') {
                        docker.image("streamgen-ai:latest").push()
                    }
                }
            }
        }
    }

    post { always { echo "Pipeline Completed." } }
}
