pipeline {
    agent any

    tools {
        nodejs 'node20'     // <-- Installed from Jenkins NodeJS plugin
    }

    environment {
        DOCKER_USERNAME = credentials('7bd1416a-ce97-4e4f-a758-46a4cedf09cd')
        DOCKER_PASSWORD = credentials('9bc34a87-85b1-477c-b6cc-e4025ec5299e')
    }

    stages {

        stage('Unit Testing') {
            steps {
                checkout scm

                sh '''
                    npm ci
                    npm test
                '''
            }
        }

        stage('Build & Test') {
            steps {
                checkout scm

                sh '''
                    npm ci
                    npm run lint || true
                    npm run build
                '''
            }
        }

        stage('Dependency Security Scan') {
            steps {
                checkout scm

                sh '''
                    npm ci
                    npm audit --audit-level=high || true
                '''
            }
        }

        stage('Docker Build & Scan') {
            steps {
                checkout scm

                sh '''
                    docker build -t streamgen-ai:latest .
                    docker save streamgen-ai:latest -o streamgen-ai.tar
                '''

                sh '''
                    trivy image --severity CRITICAL,HIGH --exit-code 0 streamgen-ai:latest
                '''

                archiveArtifacts artifacts: 'streamgen-ai.tar', fingerprint: true
            }
        }

        stage('Deploy to Docker Hub') {
            when { branch 'main' }
            steps {
                sh 'docker load -i streamgen-ai.tar'

                sh '''
                    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    docker tag streamgen-ai:latest ${DOCKER_USERNAME}/streamgen-ai:latest
                    docker push ${DOCKER_USERNAME}/streamgen-ai:latest
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline Completed."
        }
    }
}
