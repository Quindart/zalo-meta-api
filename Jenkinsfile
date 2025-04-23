pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "zalo-backend-nodejs"
    }

    stages {
        stage('Build Docker Containers') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml build'
                }
            }
        }

        stage('Start Docker Containers') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'docker-compose exec -T app npm test'  
                }
            }
        }

        stage('Stop Containers') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml down'
                }
            }
        }
    }
}
