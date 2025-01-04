const API_BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error('Login error:', responseData.message);
    throw new Error(responseData.message || 'Failed to login');
  }

  // Store token in sessionStorage instead of localStorage
  sessionStorage.setItem('authToken', responseData.token);

  return responseData;
};

// Register user
export const registerUser = async (data) => {
  const token = sessionStorage.getItem('authToken'); // Get auth token from sessionStorage

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {  // Correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Send token in the request
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();  // Read response as text to debug
    console.log('Response Text:', responseText);  // Log the raw response for debugging

    const responseData = JSON.parse(responseText);  // Parse the response text manually

    if (!response.ok) {
      console.error('Register user error:', responseData.message);
      throw new Error(responseData.message || 'Failed to register user');
    }

    return responseData;  // Return data upon successful registration
  } catch (error) {
    console.error('Error during user registration:', error);
    throw new Error('Failed to register user');
  }
};

// Fetch users
export const fetchUser = async () => {
  const token = sessionStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
};

export const deleteUser = async (id) => {
  const token = sessionStorage.getItem('authToken');
  
  // Make the DELETE request to the server
  const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Check if the response is successful
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to delete user:', errorData.message);
    throw new Error(errorData.message || 'Failed to delete user');
  }

  return await response.json();
};


export const fetchProducts = async () => {
  const token = sessionStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

// Update user information
export const updateUser = async (id, data) => {
  const token = sessionStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error updating user:', errorData.message);
    throw new Error(errorData.message || 'Failed to update user');
  }

  return await response.json();  // Returns updated user data
};

// Add product function
export const addProduct = async (data) => {
  const token = sessionStorage.getItem('authToken'); // Ensure the token exists
  console.log('Sending data to server:', JSON.stringify(data));
  console.log('Token being sent:', token);

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Raw response status:', response.status);

    // Read response as text first to debug stream issues
    const responseText = await response.text();
    console.log('Raw server response text:', responseText);

    if (!response.ok) {
      console.error('Response failed:', responseText);
      throw new Error(responseText || 'Error adding product');
    }

    const responseBody = JSON.parse(responseText); // Parse the text manually
    console.log('Parsed response body:', responseBody);

    return responseBody; // Return parsed response
  } catch (error) {
    console.error('Error during request:', error);
    throw error;
  }
};







// Delete product
export const deleteProduct = async (token, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`, // Send token in header
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete Product Error:', errorData.message);
        throw new Error(errorData.message || 'Failed to delete product');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw new Error('Failed to delete product');
    }
  };
  
  
  // Update product
  export const updateProduct = async (token, id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update Product Error:', errorData.message);
      throw new Error(errorData.message || 'Failed to update product');
    }
  
    return await response.json(); // Returns updated product
  };
  
// /quotes/
 // Save quotation request to multiple suppliers
 export const saveQuoteRequest = async (token, supplierId, products, date) => {
  console.log('Data being sent to API:', {
    supplierId,
    products,  // Ensure products is an array
    date,
  });

  // Do not include `status` in the request, as the backend will handle this
  const response = await fetch(`${API_BASE_URL}/quotes/save-quotations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      supplierId: supplierId,
      products: products,  // Array of products
      date: date,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error('Error response:', responseText);
    throw new Error(responseText || 'Failed to save quotation request');
  }

  const responseData = await response.json();
  return responseData;
};


export const fetchQuotationHistory = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/quotes/history', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('Fetched history data:', data); // Log this to debug
    return data;
  } catch (error) {
    console.error('Error during fetchQuotationHistory', error);
    throw error;
  }
};

export const fetchSupplierQuotations = async () => {
  const token = sessionStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication token is missing or expired');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/quotes/supplier/quotations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch quotations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching supplier quotations:', error);
    throw error;
  }
};

export const updateQuotationStatus = async (quotationId, status) => {
  const token = sessionStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/quotes/supplier/quotations/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quotationId, status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update quotation status');
  }

  return await response.json();
};


// Move accepted quotation to the AcceptedQuotations collection
export const moveToAcceptedQuotations = async (quotationId) => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token is missing or expired');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/quotes/move-to-accepted/${quotationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to move quotation to accepted');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error moving quotation to accepted:', error);
    throw error;
  }
};

// Fetch accepted quotations for the supplier
export const fetchAcceptedQuotationsForSupplier = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/supplier/accepted-quotations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accepted quotations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching accepted quotations: ' + error.message);
  }
};


// Add this function in api.js
export const fetchUsers = async () => {
  const token = sessionStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
};
