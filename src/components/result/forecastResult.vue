<template lang="pug">

	.popup(v-if="data")
		pageHeader(
			:useBack="false"
			:title="`${data.locationName}`"
		)
			el-link(
				:href="opendataLinkUrl"
				target="_blank"
				icon="el-icon-question"
				style="float:right;margin:0.5rem 0;"
				title="查看資料來源"
			)

		//- 項目卡片
		.cardGrid
			template(v-if="data.time")
				template(v-for="(obj, idx) in data.time")
					el-card.dataCard(shadow="hover")
						.dataCard__row
							h3 {{getDateTime(obj['dataTime'])}}
						.dataCard__row
							el-card.dataCard(shadow="hover")
								.dataCard__row
									img(fit="scale-down" style="max-height: 30px;" :src="getWxUrl(obj)" :alt="obj['Wx'][1].value")
									span
										h3.caption
											big {{obj['Wx'][1].value}}

							el-card.dataCard(shadow="hover")
								.dataCard__row
									h3 {{tab['Sky']}}
									span
										h3.caption
											big {{obj['Sky'].value}}
										el-tag(type="warning" size="medium") {{obj['Sky'].measures}}

						.dataCard__row
							template(v-for="name in windList")
								el-card.dataCard(shadow="hover")
									.dataCard__row(@click="windUnitChange(obj[name])")
										h3 {{tab[name]}}
										span
											h3.caption
												big {{getWind(obj[name]).value}}
											el-tag(type="warning" size="medium") {{getWind(obj[name]).measures}}

						.dataCard__row
							template(v-for="name in flowList")
								el-card.dataCard(shadow="hover")
									.dataCard__row(@click="flowUnitChange(obj[name])")
										h3 {{tab[name]}}
										span
											h3.caption
												big {{getFlow(obj[name]).value}}
											el-tag(type="warning" size="medium") {{getFlow(obj[name]).measures}}

						.dataCard__row
							template(v-for="name in waveList")
								el-card.dataCard(shadow="hover")
									.dataCard__row
										h3 {{tab[name]}}
										span
											h3.caption
												big {{obj[name].value}}
											el-tag(type="warning" size="medium") {{obj[name].measures}}

</template>

<script>

import pageHeader from "@/components/common/pageHeader"

export default {
	name:"forecastResult",
	components:{
		pageHeader,
	},
	data:()=>({
		waveList: ['WaveH', 'WaveD', 'WaveP'],

		flowList: ['CS', 'CD'],
		flowUnitIdx: 0,

		windList: ['WS', 'WD'],
		windUnitIdx: 0,
	}),
	props:{
		data: {
		},
		tab: {
		},
		layer: {
			lyr:Object
		},
	},
	computed:{
		opendataLinkUrl() {
			return `https://www.cwb.gov.tw/V8/C/W/Town/Town.html?TID=${this.data.geocode}`;
		},
/*		pickerOptions(){
			return {
				disabledDate: (time) => {
					if (!this.time) return true;
					const firstData = this.time[0];
					const lastData = this.time[this.time.length - 1];
					const select = time.getTime();
					return (select < firstData.startTime) || (select >= lastData.endTime);
				},
			}
		},
		dataModel(){
			if (!this.time) return null;
			console.log("dataModel()", this, this.time, this.currentDateIdx)
			return this.time[this.currentDateIdx];
		},
		currentDate: {
			get(){
				return (this.time)? this.time[this.currentDateIdx].startTime : null;
			},
			set(time) {
				this.time?.every((obj,index)=>{
					const t0 = obj.startTime;
					const t1 = obj.endTime;
					if ((time < t0) || (time >= t1)) {
						return true;
					}
					this.currentDateIdx = index;
					return false;
				})
				//console.log("[currentDate]set", this, time);
			},
		},*/
	},
	created() {

	},
	mounted() {

	},
	methods:{
		getDateTime(datetime){
			return new Date(datetime).toLocaleString();
		},
		getWxUrl(obj){
			const val = obj['Wx'][0].value;
			if (!val) return '';
			return `https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${val}.svg`;
		},
		getFlow(vals) {
			return vals[this.flowUnitIdx] || vals;
		},
		getWind(vals) {
			return vals[this.windUnitIdx] || vals;
		},
		flowUnitChange(vals) {
			if (!vals.length) return;
			this.flowUnitIdx = (this.flowUnitIdx + 1) % vals.length;
		},
		windUnitChange(vals) {
			if (!vals.length) return;
			this.windUnitIdx = (this.windUnitIdx + 1) % vals.length;
		},
	}
}
</script>

<style lang="scss">
.el-picker-panel.el-date-picker.el-popper.date-picker {
	max-width: unset;
}
</style>
<style lang="scss" scoped>

.popup{
	margin: 0 auto;
	max-width: 90vw;
	min-width: 300px;
}

.caption {
	color:$primary;
	display: inline;
	margin: 0 0.5rem;
}

.picker {
	display: table;
	margin: 0 auto;
}

.el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--date {
	max-width: max-content;
}

/deep/ {
	.el-tag,.el-card{
		border-radius: 1rem;
	}
	.el-tag{
		margin-left: 0.5rem;
	}
	.el-card{
		background-color: #fff;
		&__body{
			line-height: 150%;
		}
	}
}

.scroll{
	width: 100%;
	overflow: hidden;
	&__wrapper{
		white-space: nowrap;
	}
	&__content{
		display: inline-block;
	}
	&__item{
		display: inline-block;
		padding: 1rem;
		margin: 0.5rem;
		border-radius: 1rem;
		border: 1px solid $info;
	}
}

.cardGrid{
	flex-wrap: wrap;
}

.dataCard{
	flex: 1 1 300px;
	margin: 0.5rem;
	&--actived{
		background-color: rgba($primary,0.1);
		border: 1px solid $primary;
	}
	@media screen and (max-width:768px){
		flex: 1 1 300px;
		&--actived{
			position: sticky;
			bottom: 1rem;
			background-color: $primary;
			color: #ffffff;
			.caption{ color: #ffffff; }
		}
	}
	&__row {
		&>*{
			margin: 0;
		}
		display:flex;
		justify-content:space-between;
		align-items: center;
	}
}

</style>
