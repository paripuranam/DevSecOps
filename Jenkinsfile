pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKER_USERNAME = credentials('7bd1416a-ce97-4e4f-a758-46a4cedf09cd')
        DOCKER_PASSWORD = credentials('9bc34a87-85b1-477c-b6cc-e4025ec5299e')
    }

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
                    
                    // Scan image using Trivy in a container
                    docker.image('aquasec/trivy:latest').inside {
                        sh "trivy image --severity CRITICAL,HIGH --exit-code 0 streamgen-ai:latest"
                    }

                    // Save the artifact
                    sh 'docker save streamgen-ai:latest -o streamgen-ai.tar'
                }
                archiveArtifacts artifacts: 'streamgen-ai.tar', fingerprint: true
            }
        }

        stage('Deploy to Docker Hub') {
            when { branch 'main' }
            steps {
                script {
                    docker.withRegistry('', 'docker-credentials-id') {
                        def image = docker.image("streamgen-ai:latest")
                        image.push()
                    }
                }
            }
        }
    }

    post {
        always { echo "Pipeline Completed." }
    }
}
