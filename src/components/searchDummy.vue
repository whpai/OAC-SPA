<template lang="pug">

.search2
	.search2__finder
		el-select(
			style="width:100%;"
			v-model="selectedSearchTypeModel"
			filterable
			placeholder="選擇查詢主題"
			placement="bottom"
			popper-class="selectItems"
			clearable
		)
			el-option(
				v-for="i in searchTypes"
				:key="i.value"
				:label="i.label"
				:value="i.value"
			)
			template(slot="prefix")
				el-button(
					style="position:absolute;"
					circle
					type="primary" 
				)
					.tools__button
						font-awesome-icon(icon="filter" fixed-width size="lg")
		el-select.fill(
			style="width: 100%;"
			v-model="selectedResultModel"
			filterable
			placeholder="輸入關鍵字"
			placement="bottom"
			popper-class="selectItems"
			clearable
			remote
			:remote-method="remoteSearch"
			:loading="loading"
			:loading-text="loadingText"
		)
			el-option(
				v-for="i in results"
				:key="i.key"
				:label="i.label"
				:value="i.value"
			)

		a.dummy-link(:href="url" target="_blank" rel="noopener noreferrer nofollow" ref="dummy-link")


</template>

<script>

import {mapGetters,mapActions, mapMutations} from 'vuex'

export default {
	name :"searchDummy",
	data:()=>({
		LayerToFilt:null, // layerID

		searchDefine: [
			{
				fn: 0,
				label: '海域遊憩設施'
			},
			{
				fn: 1,
				label: '海域活動布告欄'
			},
			{
				fn: 2,
				label: '海域活動申請規定'
			},
		],

		selectedType: '',
		searchTypes: [], // display
		selectedResult: '',
		results: [], // display
		selectSearchFn: null,
		loading: false,
		loadingText: '搜尋中...',
	}),
	computed:{
		...mapMutations({
			SNAPSHOT_RAW_LAYER:"layer/SNAPSHOT_RAW_LAYER",
		}),
		layers(){
			return this.$store.state.layer.layer
		},
		selectedSearchTypeModel:{
			get(){
				return this.selectedType
			},
			set(val){
console.log('[search]click type', this, val);
				this.selectedType = val;

				let mapFn = {
					'0': this.searchPoint,
					'1': this.searchAnno,
					'2': this.searchRule,
				}
				let fn = mapFn[val];
				this.selectSearchFn = fn;
				this.results = [];
				this.selectedResult = '';
			}
		},
		selectedResultModel:{
			get(){
				return this.selectedResult
			},
			set(value){
console.log('[search]click data', this, value);
				this.selectedResult = value;
				let {val, clickFn} = value;
				if (clickFn) clickFn(val);
			}
		},
	},
	async created(){
		/*let layer = this.$LayerIns.normalLayerCollection.find(l => l.title == 'dummy');
		if (!layer) {
			await this.$LayerIns.addLayer({
				"title": "dummy",
				"visible": true,
				"type": "clusterMark",
				"tag": [],
				"layerOption": {
					"icon": "exclamation",
				}
			});
			let layer = this.$LayerIns.normalLayerCollection.find(l => l.title == 'dummy');
			this.SNAPSHOT_RAW_LAYER({
				type:"layer",
				payload: layer,
			});
		}*/
		const layer = this.$LayerIns.normalLayerCollection.find(l => !!l.index)
		if (!layer.index) return;
		this.LayerToFilt = layer.id;

		this.searchDefine.forEach((val, idx) => {
			this.searchTypes.push({
				label: val.label,
				value: val.fn,
			});
		});
console.log('[search]created', this, this.searchDefine);
	},
	methods:{
		remoteSearch(query) {
console.log('[remoteSearch]query', this, query);
			if (query !== '') {
				this.loading = true;
				let fn = this.selectSearchFn;
				if (fn) {
					fn(query);
					return;
				}
			}
			this.results = [];
		},
		searchPoint(query) {
			let data = [
				{
					tag: '廁所',
					count: 3,
					reg: '高雄市',
					twn: '衝浪',
				},
				{
					tag: '充電',
					count: 2,
					reg: '高雄市',
					twn: '海鮮',
				},
			];

			this.loading = true;
			setTimeout(() => {
				this.loading = false;
				let clickFn = this.showMark;
				let res = [];
				data.forEach((val, idx) => {
					if (!val.tag.includes(query)) return;
					res.push({
						label: `符合資料共${val.count}筆`,
						value: Object.freeze({val, clickFn}),
						key: idx,
					});
				});
				this.results = res;
			},  this.rngDelay(800, 1500));
		},
		searchAnno(query) {
			let data = [
				{
					title: '海巡偕同師生淨灘，攜手恢復海灘樣貌',
					url: 'https://www.cga.gov.tw/GipOpen/wSite/ct?xItem=141399&ctNode=650&mp=999',
				},
				{
					title: '天天都是你的國際淨灘行動 請一起這樣愛海洋',
					url:  'https://www.sow.org.tw/faq/myiccday',
				},
			];

			this.loading = true;
			setTimeout(() => {
				this.loading = false;
				let res = [];
				let clickFn = this.openUrl;
				data.forEach((val, idx) => {
					if (!val.title.includes(query)) return;
					res.push(Object.freeze({
						label: val.title,
						value: Object.freeze({val, clickFn}),
						key: idx,
					}));
				});
				this.results = res;
			},  this.rngDelay(100, 800));
		},
		searchRule(query) {
			let data = [
				{
					title: '基隆市島礁磯釣活動 - 基隆市政府、基隆區漁會',
					url: 'https://www.icellars.tw/keelungreeffishing/auth/login.html',
				},
				{
					title: '台江國家公園水域 - 遊憩活動申請須知及相關附件',
					url: 'https://www.tjnp.gov.tw/PublicInformationDetail.aspx?Cond=83713bde-e4e4-4f5c-a8ad-ed4cc0d60c34',
				},
			];

			this.loading = true;
			setTimeout(() => {
				this.loading = false;
				let res = [];
				let clickFn = this.openUrl;
				data.forEach((val, idx) => {
					if (!val.title.includes(query)) return;
					res.push({
						label: val.title,
						value: Object.freeze({val, clickFn}),
						key: idx,
					});
				});
				this.results = res;
			}, this.rngDelay(100, 500));
		},
		openUrl(val) {
console.log('[openUrl]goto', this, val);
			let ele = this.$refs["dummy-link"];
			let url = val.url;
			ele.href = url;
			ele.click();
		},
		showMark(val) {
console.log('[showMark]', this, val);
			const layer = this.$LayerIns.normalLayerCollection.find(l => l.id === this.LayerToFilt)
			layer.showOnly(val.reg, val.twn);

			const bound = layer.markerClusterGroup.getBounds();
			const {map} = this.$InitIns;
			map.flyToBounds(bound);
		},
		rngDelay(min, max = 0) {
			return (~~(Math.random() * (max-min))) + min;
		},
	}
}
</script>

<style lang="scss" scoped>
	
	.search2 {
		margin:0.5rem 0 !important;
		.el-button{
			box-shadow:0 0 6px 3px rgba(0,0,0,0.2);
		}
		&>*{
			margin:1rem 0;
		}
		&__finder{
			display: flex;
			/deep/ {
				.el-input{
					&__prefix{
						left:0;
						margin: 0;
					}
					&__inner{
						padding-left: 55px;
						border-radius: 999px;
						box-shadow:0 0 6px 3px rgba(0,0,0,0.2);
					}
				}

				.el-select.fill {
					.el-input__inner {
						padding-left: 1em;
					}
				}
			}
		}
	}

	@media only screen and (max-width: 576px) {
		.search2 {
			&__finder{
				display: block;
				text-align: center;
				/deep/ {
					.el-input{
						margin: .5em 0;
					}
				}
			}
		}
	}

	.selectItems * {
		color: $primary !important;
		font-weight: normal !important;
	}

</style>
