// const config = {
//     progressUrl: "https://dev.sitesched.com/projects/c760b05b-fd01-407a-a373-955d65455c5f/progress?view=table",
//     mAuthToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NjdmYzg1MS00ZTBkLTQ0ODMtODZjNC02ZjcwNWVkOTQ0ODAiLCJyaWQiOiJhOTNmY2JjMS1iZDM2LTRkYTAtOTYyZi02MjNlZmJiYzMzMzciLCJpYXQiOjE3NDM3MjA5NDMsImV4cCI6MTc0MzczMTc0M30.Cs-gnmLbcS7WdCxRTTIrZq07QJkyqFWYU5A8TQr13Dk",
//     mAuthUser: "%7B%22id%22%3A%22867fc851-4e0d-4483-86c4-6f705ed94480%22%2C%22email%22%3A%22testexample%40tandukrusa.com%22%2C%22name%22%3A%22Tychus%20Bardashi%22%2C%22phone%22%3Anull%2C%22roleId%22%3A%22a93fcbc1-bd36-4da0-962f-623efbbc3337%22%2C%22workerType%22%3Anull%2C%22companyName%22%3Anull%2C%22number%22%3Anull%2C%22street%22%3Anull%2C%22suburb%22%3Anull%2C%22state%22%3Anull%2C%22postalCode%22%3Anull%2C%22country%22%3Anull%2C%22status%22%3A1%2C%22availability%22%3A1%2C%22createdAt%22%3A1675645802107%2C%22updatedAt%22%3A1675645802107%2C%22Role%22%3A%7B%22id%22%3A%22a93fcbc1-bd36-4da0-962f-623efbbc3337%22%2C%22name%22%3A%22Head%20Contractor%22%2C%22createdAt%22%3A1703076598564%2C%22updatedAt%22%3A1703076598564%7D%7D"
// }

// module.exports = config
import dotenv from 'dotenv';

dotenv.config({ path: `./${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}.env` });

export const config = {
	port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || "https://dev.sitesched.com",
    credentials: {
        email: process.env.EMAIL || "",
        password: process.env.PASSWORD || "",
    },
    projectId: process.env.PROJECT_ID || "",
    mAuthToken: process.env.MAUTH_TOKEN || "",
    mAuthUser:  process.env.MAUTH_USER || ""
};
