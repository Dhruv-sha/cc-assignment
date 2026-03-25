provider "aws" {
  region = "ap-south-1"
}

resource "aws_security_group" "node_app_sg" {
  name = "node-app-sg"

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "node_app" {
  ami           = "ami-0f58b397bc5c1f2e8"
  instance_type = "t2.micro"
  key_name      = "your-key-name"

  security_groups = [aws_security_group.node_app_sg.name]

  user_data = <<-EOF
              #!/bin/bash

              # Update system
              yum update -y

              # Install Docker
              amazon-linux-extras install docker -y
              service docker start
              usermod -aG docker ec2-user

              # Install Git
              yum install git -y

              # Go to home
              cd /home/ec2-user

              # Clone repo
              git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

              cd YOUR_REPO

              # Build Docker image
              docker build -t cc-assignment .

              # Run container
              docker run -d -p 5000:5000 cc-assignment
              EOF

  tags = {
    Name = "NodeDockerApp"
  }
}