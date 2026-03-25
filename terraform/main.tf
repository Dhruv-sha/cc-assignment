provider "aws" {
  region = "ap-south-1"
}

resource "aws_security_group" "node_app_sg" {
  name        = "node-app-sg"
  description = "Allow HTTP on port 3000 and SSH"

  ingress {
    description = "App port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
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

  tags = {
    Name = "node-app-sg"
  }
}

resource "aws_instance" "node_app" {
  ami                    = "ami-0f58b397bc5c1f2e8"
  instance_type          = "t2.micro"
  key_name               = "dhruv"
  vpc_security_group_ids = [aws_security_group.node_app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system
              yum update -y

              # Install Docker
              amazon-linux-extras install docker -y
              service docker start
              usermod -aG docker ec2-user

              # Install Git
              yum install git -y

              # Clone repo
              cd /home/ec2-user
              git clone https://github.com/Dhruv-sha/cc-assignment.git app
              cd app

              # Build and run Docker container
              docker build -t cc-assignment .
              docker run -d -p 3000:3000 --restart unless-stopped cc-assignment
              EOF

  tags = {
    Name = "NodeDockerApp"
  }
}

output "app_url" {
  description = "Public URL of the running app"
  value       = "http://${aws_instance.node_app.public_ip}:3000"
}