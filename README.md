# TravelDiary-Platform 🌍✈️📖
This is a platform for share your travel diary.(CS5610 project2).
The Travel Diary Platform is a web application where users can register, log in, and post details about their travels. 
![image](https://unknownfanzh.github.io/TravelDiary-Platform/public/images/screenshot.gif)
- Author: Fan Zhou & Tianjing(Jill) Liu
- Design Doc: https://drive.google.com/file/d/1q6o_AIC588qLvTXcs4i8LzHas-Erhb3c/view?usp=sharing
- Prensentation slides: https://docs.google.com/presentation/d/1z7PrsJyTVHzY1G6azjd5I7nNBWcZocoszvcLT7PE5hQ/edit#slide=id.gcb9a0b074_1_213
- Video walkthrough: https://youtu.be/ZwDivI4WMEs
- Wireframe: https://www.figma.com/file/7sZQ3r6xg8bVxAsWEm6H5h/Project2
- A project from course CS5610: https://johnguerra.co/classes/webDevelopment_fall_2023/
- Deployed here: [https://travel-diary-platform.onrender.com](https://travel-diary-platform.onrender.com)
- Fan's Home page: https://unknownfanzh.github.io/Personal_homepage/
- Tianjing's Home page: https://jjjing2023.github.io/

## Project Objective
The Travel Diary Platform is a web application where users can register, log in, and post details about their travels. Users can upload images(url), describe the location, date, and provide a brief description of their travel experiences. They can also edit and delete their posts, and view details about specific trips.


## Features 🌟
- **User Authentication**:
    - Login and Logout
    - Secure password hashing
- **Post Management**: 
    - Create new posts with images, locations, and descriptions
    - Update existing posts
    - Delete unwanted posts
- **Interactive UI**:
    - View all posts in a visually appealing format
    - Edit and delete buttons for each user's individual posts

## Release 1.0.0 🚀
### What's New
- **Initial Launch**:
    - First release of the Travel Diary Platform.
    - User authentication system fully operational.
    - Post creation, editing, and deletion functionality is available.
    - Interactive UI to view all posts.
    - Enhanced security features to keep user data safe.

## Technologies Used
### Frontend:
- **HTML, CSS, JavaScript**: Core building blocks for the web application.
- **Bootstrap**: Framework used for designing responsive and mobile-first UI.
### Backend:
- **Node.js**: JavaScript runtime used for server-side logic.
- **Express**: Web application framework for building APIs in Node.js.
- **MongoDB**: NoSQL database for storing user and post data.

### Authentication:
- **bcrypt**: Library for hashing and checking passwords, enhancing security.

### Other:
- **Fetch API**: Used for making requests to the backend.
- **Local Storage**: Utilized for storing user authentication tokens and other pertinent data client-side.

## Getting Started 🚀
### Prerequisites 📋
Ensure you have Node.js and MongoDB installed on your machine.

### Installation 💻
1. Clone the repository:
```
git clone https://github.com/Unknownfanzh/TravelDiary-Platform.git
```
2. Navigate into the directory:
```
cd travel-diary-platform
```
3. Install the required dependencies:
```
npm install
```
4. Start the server:
```
npm start
```
Visit http://localhost:3000 in your browser to access the platform.

## Deployment
The website is hosted using heroku and can be accessed [here]().

## Configuration 🛠️

Ensure you have a .env file in the root directory with the following content:
```
MONGODB_PASSWAOORD = <Your MONGODB password>
```

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
GitHub: https://github.com/Jjjing2023
-
