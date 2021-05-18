import Vue from "vue" 
import Vuex from "vuex" 


/* 导入模块 */
import goods from './modules/goods.js';
import cart from './modules/cart.js';
/* 导入属性选项 */
import state from './state.js';
import getters from './getters.js';
import mutations from './mutations.js';
import actions from './actions.js';

Vue.use(Vuex)

/* 导出store */
const store = new Vuex.Store({
	modules:{goods,cart},
	state,
	getters,
	mutations,
	actions
})
export default store