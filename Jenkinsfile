@Library("Shared") _
pipeline{
    
    agent any
    
    stages{
        stage("hello"){
            steps{
                echo "Version 1"
                script{
                    hello()
                }
            }
        }
        stage("code"){
            steps{
                script{
                    clone()
                }
            }
        }
        stage("build"){
            steps{
               script{
                   build()
               }
            }
        }
        stage("push"){
            steps{
                script{
                    push()
                }
            }
        }
        stage("deploy"){
            steps{
                echo "Deploying stage"
                sh "docker compose up -d"
            }
        }
    }
}
