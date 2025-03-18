/**
 * models目录下的所有js，都属于全局model；
 * 另外还有页面级的model，页面级的model彼此隔离；
 * 更多资料请参看：https://umijs.org/zh/guide/with-dva.html#model-%E6%B3%A8%E5%86%8C
 */
import { userAPI } from '@/utils/service';
// import lodash from 'lodash';

export default {
    namespace: 'users',
    state: {
        collapsed: false,
    },
    reducers: {
        save(state, action) {
            Object.keys(action.payload).map(item => {
                state[item] = action.payload[item];
            });
            return state;
        },
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    effects: {
        *fetchData({ apiKey, payload = {}, ...extra }, { call, put }) {
            let result = yield call(userAPI.getlist, apiKey, { payload, extra });
            if (extra.isPaging) {
                // 是否分页
                return result
            }
            return result;
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            // if (window.Cookies.get('mt_id')) {
            // dispatch({
            //     type: 'getquerymyapp',
            // });
            // }
        },
    },
};
