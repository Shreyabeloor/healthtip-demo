import User from '@/models/user';

import * as MutationTypes from './mutation-types';

const state = {
  accessToken: localStorage.getItem('access_token'),
  idToken: JSON.parse(localStorage.getItem('id_token_payload')),
  expiresAt: localStorage.getItem('expires_at'),
};

const mutations = {
  [MutationTypes.LOGIN](state) {
    state.accessToken = localStorage.getItem('access_token');
    state.idToken = JSON.parse(localStorage.getItem('id_token_payload'));
    state.expiresAt = localStorage.getItem('expires_at');
  },
  [MutationTypes.LOGOUT](state) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token_payload');
    localStorage.removeItem('expires_at');
    state.accessToken = null;
    state.idToken = null;
    state.expiresAt = null;
  },
};

const getters = {
  authString(state) {
    return 'Bearer ' + state.accessToken;
  },
  currentUser(state) {
    return state.idToken;
  },
  isAuthenticated(state) {
    // Check whether the current time is past the
    // Access Token's expiry time
    return state.expiresAt && new Date().getTime() < state.expiresAt;
  },
};

const actions = {
  login({commit}) {
    let authResult = localStorage.getItem('authResult');
    if (authResult) {
      localStorage.removeItem('authResult');
      authResult = JSON.parse(authResult);
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime(),
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem(
        'id_token_payload',
        JSON.stringify(authResult.idTokenPayload),
      );
      localStorage.setItem('expires_at', expiresAt);
      commit(MutationTypes.LOGIN);
    }
  },

  logout({commit}) {
    commit(MutationTypes.LOGOUT);
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
