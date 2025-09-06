import axios from 'axios';

// TODO: After setting up Amplify, import it here.
// import { Auth } from 'aws-amplify';

const api = axios.create({
  // This should point to your local SAM API endpoint
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: This interceptor should be updated to use Amplify Auth.
// It will fetch the current user's session and inject the JWT token.
api.interceptors.request.use(async (config) => {
  try {
    // const session = await Auth.currentSession();
    // const token = session.getIdToken().getJwtToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
  } catch (e) {
    // console.log('No user session found');
  }
  return config;
});

export default api;
