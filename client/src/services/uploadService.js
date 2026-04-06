import axios from 'axios';

const API_URL = '/api/upload';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
        };
    }
    return { 'Content-Type': 'multipart/form-data' };
};

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(API_URL, formData, {
        headers: getAuthHeaders()
    });
    
    return response.data; // { message, imageUrl }
};

const uploadService = {
    uploadImage
};

export default uploadService;
