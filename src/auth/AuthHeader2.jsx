export default function authHeader2() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      // for Node.js Express back-end
      return {
              'Content-Type': 'multipart/form-data',
              'Authorization': "Bearer " + user.token
            };
    } else {
      return {};
    }
  }