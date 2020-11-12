export default {
	namespaced: true,
	state: {
		currentRegion: null,
		currentTag: null,
	},
	actions: {},
	mutations: {
		/** 紀錄觀光景點過濾 */
		SET_CURRENT_FILTER: (state, { region, tag }) => {
			state.currentRegion = region
			state.currentTag = tag
		},
	},
	getters: {
		currentRegion: state => state.currentRegion,
		currentTag: state => state.currentTag,
	},
}
