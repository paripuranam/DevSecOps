pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker-username')   // Jenkins credential ID
        DOCKER_PASSWORD = credentials('docker-password')   // Jenkins credential ID
    }

    options {
        skipStagesAfterUnstable()
        timestamps()
    }

    stages {
        stage('Unit Testing') {
            agent { label 'node' }    // Optional: requires a node agent
            steps {
                checkout scm

                script {
                    sh '''
                        echo "Setting up Node.js 20"
                        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    '''

                    sh '''
                        npm ci
                        npm test
                    '''
                }
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
                    echo "Building Docker image..."
                    docker build -t streamgen-ai:latest .
                '''

                sh '''
                    echo "Saving image artifact..."
                    docker save streamgen-ai:latest -o streamgen-ai.tar
                '''

                // Trivy Scan
                sh '''
                    echo "Running TRIVY security scan..."
                    trivy image --severity CRITICAL,HIGH --exit-code 0 streamgen-ai:latest
                '''

                archiveArtifacts artifacts: 'streamgen-ai.tar', fingerprint: true
            }
        }

        stage('Deploy to Docker Hub') {
            when {
                branch 'main'
            }
            steps {

                script {
                    echo "Loading Docker image artifact..."
                    sh 'docker load -i streamgen-ai.tar'

                    echo "Logging into Docker Hub"
                    sh """
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    """

                    echo "Pushing Docker image"
                    sh """
                        docker tag streamgen-ai:latest ${DOCKER_USERNAME}/streamgen-ai:latest
                        docker push ${DOCKER_USERNAME}/streamgen-ai:latest
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline Completed."
        }
    }
}
