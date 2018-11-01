import { createStore, applyMiddleware, combineReducers } from 'redux';
import loggerMiddleware from 'redux-logger'
import thunk from 'redux-thunk';
import axios from 'axios'

//----------------------------------------------------------------------

const LOAD_PRODUCTS = 'LOAD_PRODUCTS';
const LOAD_REVIEWS = 'LOAD_REVIEWS';
const LOAD_USERS = 'LOAD_USERS';
const GET_ME = 'GET_ME'

//----------------------------------------------------------------------

const productReducer = (state = [], action) => {
  switch(action.type){
    case LOAD_PRODUCTS:
      state = action.products;
      break;
  };
  return state;
};

const reviewReducer = (state = [], action) => {
  switch(action.type){
    case LOAD_REVIEWS:
      state = action.reviews;
      break;
  };
  return state;
};

const userReducer = (state = [], action) => {
  switch(action.type){
    case LOAD_USERS:
      state = action.users;
      break;
  };
  return state;
};

const loggedInUserReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ME:
      state = action.loggedInUser;
      break;
    }
    return state
};

const reducer = combineReducers({
  products: productReducer,
  reviews: reviewReducer,
  users: userReducer,
  loggedInUser: loggedInUserReducer
});

export default createStore(reducer, applyMiddleware(thunk, loggerMiddleware));

//----------------------------------------------------------------------

const _loadProducts = (products) => ({
  type: LOAD_PRODUCTS,
  products
});

const _loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews
});

const _loadUsers = (users) => ({
  type: LOAD_USERS,
  users
});

 const _getMe = (loggedInUser) => ({
  type: GET_ME,
  loggedInUser
})

//----------------------------------------------------------------------

export const loadProducts = () => {
  return (dispatch) => {
    return axios.get('/api/products/')
      .then(response => response.data)
      .then(products => {
        dispatch(_loadProducts(products))
      });
  };
};

const loadReviews = () => {
  return (dispatch) => {
    return axios.get('/api/reviews/')
      .then(response => response.data)
      .then(reviews => {
        dispatch(_loadReviews(reviews))
      });
  };
};

const loadUsers = () => {
  return (dispatch) => {
    return axios.get('/api/users')
      .then(response => response.data)
      .then(users => {
        dispatch(_loadUsers(users))
      });
  };
};


// gets logged in user
export const getMe = () => dispatch => {
  return axios.get('/auth/me')
    .then(res => res.data)
    .then(loggedInUser => {
      console.log("USER",loggedInUser)
      dispatch(_getMe(loggedInUser))
    })
    .catch(error => console.log(error))
}


//authorizes user
export const login = (credentials) => dispatch => {
    return axios.put('/auth/login', credentials)
    .then(res => res.data)
    .then( (loggedInUser) => dispatch(getMe(loggedInUser)))
  }


export const logout = () => dispatch => {
  return axios.delete('/auth/logout')
    .then(() => dispatch(_getMe({})))
    .catch(console.error.bind(console))
}