# Social Media Application 

## Getting Started

1. **Clone the Repository**: Clone the repository to your local machine using Git:

   ```
   git clone https://github.com/D3ewan/social-media.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies:

   ```
   npm install
   ```
3. **Add .env file**: Take the reference of  .env.example

4. **Start the Application**: Once the dependencies are installed, start the application in dev mode by running these commands in the terminal:

   ```
   npm run dev
   ```

   or

   ```
   npm run build && npm run start
   ```
5. **Test the application**: You can test application by running these commands in the terminal:
   ```
   npm run test
   ```

## Steps to run Docker Image

To run a Docker image, follow these steps:

1. **Pull the Docker Image (if necessary):** If the Docker image is not available locally, you need to pull it from a Docker registry. You can use the `docker pull` command to do this.
   
    ```bash
   docker pull deewansingh7/social-media:v1
    ```

3. **Run the Docker Image:** Once the Docker image is available locally, you can run it using the `docker run` command. Replace `<image_name>` with the name of the Docker image you want to run:

    ```bash
    docker run -p 4000:<SERVER_PORT_NO> deewansingh7/social-media:v1
    ```
