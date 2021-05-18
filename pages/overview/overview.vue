<template>
	<view>
		<!-- <view class="setpotions">
			<view @tap="gotab('orderState')" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-order2"></text>
					<text class="setpotions-title">订单管理</text>
			</view>
			<view @tap="gotab('orderMenu')" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-menu"></text>
					<text class="setpotions-title">餐品管理</text>
			</view>
			<navigator url="../optionsData/optionsData" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-data"></text>
					<text class="setpotions-title">数据管理</text>
			</navigator>
			<navigator url="" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-theme"></text>
					<text class="setpotions-title">主题</text>
			</navigator>
		</view> -->
		<view class="turnover-ring">
			<view class="canvas-title">
				{{turnover_ring.picker.now}}营业额
			</view>
			<view class="canvas-nav">
				<text v-for="(item,index) in turnover_ring.picker.range" :key="item" @tap="RingCanvasNav(item,index)"
					 :canvas2d="true"
					class="turnover-sel" :class="turnover_ring.picker.selected==index?'turnover-sel-active':''" 
				>{{item}}
				</text>
			</view>
			<view class="canvas-ring">
				<qiun-data-charts background="none" type="ring"  :chartData="turnover_ring.data"  :canvas2d="true"
				:animation="false" :opts="turnover_ring.opts" />
			</view>
		</view>
		<view class="turnover-mix">
			<view class="canvas-title">
				{{turnover_mix.picker.now}}收入趋势图
			</view>
			<view class="canvas-nav">
				<text v-for="(item,index) in turnover_mix.picker.range" :key="item" @tap="MixCanvasNav(item,index)"
					:canvas2d="true" canvasId="c1" 
					class="turnover-sel" :class="turnover_mix.picker.selected==index?'turnover-sel-active':''" 
				>{{item}}
				</text>
			</view>
			<view class="charts-mix">
				<qiun-data-charts type="mix"  :canvas2d="true" canvasId="c2" 
				:chartData="turnover_mix.data" :ontouch="true"  
				:disableScroll="true" background="none" :opts="turnover_mix.opts" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				rangedate:3,
				total:{current:0,today:0,history:0},
				turnover_ring: { //环形图：本日收入占比
					picker:{range:['当前','今日','本月','全部'],selected:1,now:'今日',storagekey:'orderList_today'},
					opts: {
						"title": {
							"name": "日营业额",
							"fontSize": 16,
							"color": "#666666",
						},
						"subtitle": {
							"name": "0元",
							"fontSize": 18,
							"color": "#7cb5ec",
						}
					},
					data:{
						"series": [
							{
								"data":[
									{
										"name": "面食类",
										"value":0,
									},
									{
										"name": "盖饭",
										"value":0,
									},
									{
										"name": "炒饭",
										"value":0,
									},
									{
										"name": "砂锅米线",
										"value":0,
									},
								/* 									{
										"name": "饮料",
										"value":0,
									},
									{
										"name": "炒菜",
										"value":0,
									},
									{
										"name": "其他",
										"value":0,
									}, */
								],
							}
						]
					}
				},
				turnover_mix: {//混合图表：收入趋势
					picker:{range:['近七日','本月','近三月','全部'],selected:0,now:'本月',rangeNum:1},
					opts:{
						"touchMoveLimit": 60,//scroll时重新渲染的帧数
						"enableScroll": false,
						"padding": [0,20,0,30],
						"dataLabel":true,
						 "legend": {
						        "padding": 2,
						        "margin": 2,
						    },
						"xAxis": {
								"disabled":false,
								"labelCount":0,
						        "itemCount": 7,
						        "scrollShow": false,
								"boundaryGap": "justify",
						    },
						"yAxis": {
							"data": [
								{
									"position": "right",
									"title": "日利润（元）",
									"max": 500,
								},
								{
									"position": "left",
									"title": "日营业额（元）",
									"textAlign": "left"
								},
							]
						}
					},
					data:{
						"categories": [],
						"series": [
							{
								"name": "日营业额",
								"index": 1,
								"data": [374, 432, 573, 357, 412, 576, 323],
								"type": "line"
							},
							{
								"name": "利润",
								"data": [170, 214, 285, 184, 206, 367, 162],
								"type": "column",
								"color": "#2fc25b"
							},
						]
					}
				},

			};
		},
		computed:{
			...mapState(['orderList_today'])
		},
		watch:{
		},
		onShow() {
			this.RingCanvasNav('今日',1)
			this.updateMixcanvas()
		},
		onPullDownRefresh() {
			this.RingCanvasNav('今日',1)
			this.updateMixcanvas()
		},
		methods: {
			full2(num) { //保留日期为2位数字符
				if (num < 10) return '0' + num
				else return num
			},
			/* gotab(tab){
				console.log('/pages/'+tab+'/'+tab)
				uni.switchTab({
				    url: '/pages/'+tab+'/'+tab
				});
			}, */
			updateMonth(){
				//获取当月最后一天
				let nowDate=new Date()
				let y = nowDate.getFullYear(), m = parseInt(nowDate.getMonth()+1),d=nowDate.getDate()
				let startDate = new Date(y,m,1),lastDate = new Date(y, m+1, 0)
				let startid=startDate.getFullYear()+this.full2(startDate.getMonth())+this.full2(startDate.getDate()),
					endid=lastDate.getFullYear()+this.full2(lastDate.getMonth())+this.full2(lastDate.getDate())
				startid=parseInt(startid)
				endid=parseInt(endid)
				console.log(startid,endid)
				//在历史数据中筛选符合当月的订单集合
				let orders = uni.getStorageSync('orderList_history')
				let orderid=''
				let eligible=[]
				for(let order of orders){
					orderid=parseInt(order.id.slice(0,8))
					if(orderid>=startid && orderid<=endid)
					eligible.push(order)
				}
				uni.setStorageSync('orderList_month',eligible)
				console.log('已计算本月数据',eligible)
			},
			RingCanvasNav(item,index){//更新营业额选项
				console.log(index)
				//根据picker选项确定统计范围
				let picker=this.turnover_ring.picker
				picker.now=item;picker.selected=index;
				let opts=this.turnover_ring.opts
				
				switch (index){
					case 0:{picker.storagekey='current';opts.title.name='当前营业额';}break;
					case 1:{picker.storagekey='today';opts.title.name='今日营业额';}break;
					case 2:{picker.storagekey='month';opts.title.name='本月营业额';this.updateMonth();}break;
					case 3:{picker.storagekey='history';opts.title.name='总营业额';picker.now='总'}break;
					default:picker.storagekey='today';break;
				}
				this.updateRingcanvas(picker.storagekey)
			},
			updateRingcanvas(storagekey){//更新ring数据
				let orders=uni.getStorageSync('orderList_'+storagekey)
				let noodles=0,rice={gai:0,chao:0},mixian=0,stirfry=0,drinks=0,others=0
				//计算各品类的金额总和
				if(orders!='')for(let order of orders){
					for(let food of order.data){
						switch (food.type.en){
							case 'noodle':noodles+=food.price;break;
							case 'mixian':mixian+=food.price;break;
							case 'rice':{
								if(food.name.includes('盖饭'))rice.gai+=food.price
								else if(food.name.includes('炒饭'))rice.chao+=food.price
							}break;
							case 'stirfry':stirfry+=food.price;break;
							case 'drinks':drinks+=food.price;break;
							default:others+=food.price;break;;break;
						}
					}
				
				}
				//各品类总金额分别赋值
				let data=this.turnover_ring.data.series[0].data
				data[0].value=noodles
				data[1].value=rice.gai
				data[2].value=rice.chao
				data[3].value=mixian
				/* data[4].value=stirfry//没有添加此品类，故不用
				data[5].value=drinks
				data[6].value=others */
				//总金额
				let sum=noodles+rice.gai+rice.chao+mixian+stirfry+drinks+others
				this.turnover_ring.opts.subtitle.name=sum+'元'
			},
			MixCanvasNav(item,index){//更新收入趋势图选项
				console.log(item,index)
				let picker=this.turnover_mix.picker
				picker.selected=index;picker.now=item
				let xAxis=this.turnover_mix.opts.xAxis
				switch (index){
					case 0:{picker.rangeNum=0;this.turnover_mix.opts.enableScroll=false;this.turnover_mix.opts.dataLabel=true;xAxis.disabled=false;xAxis.labelCount=0;xAxis.itemCount=7;xAxis.scrollShow=false}break;
					case 1:{picker.rangeNum=1;this.turnover_mix.opts.enableScroll=true;this.turnover_mix.opts.dataLabel=true;xAxis.disabled=false;xAxis.labelCount=11;xAxis.itemCount=11;xAxis.scrollShow=true}break;
					case 2:{picker.rangeNum=2;this.turnover_mix.opts.enableScroll=false;this.turnover_mix.opts.dataLabel=false;xAxis.disabled=true;xAxis.labelCount=90;xAxis.itemCount=90;xAxis.scrollShow=false};break;
					case 3:{picker.rangeNum=4;this.turnover_mix.opts.enableScroll=false;picker.now='历史';this.turnover_mix.opts.dataLabel=false;xAxis.disabled=true;xAxis.labelCount=90;xAxis.itemCount=90;xAxis.scrollShow=true};break;
					default:picker.rangeNum=0;break;
				}
				this.updateMixcanvas()
			},
			updateMixcanvas(){//更新收入趋势图数据
				let orders=uni.getStorageSync('orderList_history')
				//获取当月最后一天
				let nowDate=new Date()
				let y = nowDate.getFullYear(), m = parseInt(nowDate.getMonth()),d=nowDate.getDate()
				let lastDate = new Date(y, m+1, 0)//加一个月,d=0为-1天，即上个月最后一天
				let lastDay=lastDate.getDate()
				//数据存放
				let mixdata=[],sum=0,categories=[]
				//日期id标识
				let [y1, m1, d1]=['','','']
				let id = ''
				//mix的selected序号
				let selected=this.turnover_mix.picker.selected
				//根据selected序号进行筛选
				if(selected===0){
					
					for(let i=6;i>=0;i--){
						sum=0
						//计算id的日期
						let date= new Date()
						date.setDate(nowDate.getDate()-i)
						y1 = date.getFullYear()
						m1 = this.full2(date.getMonth() + 1)
						d1 = this.full2(date.getDate())
						id = y1 + m1 + d1
						for(let order of orders){
							if(order.id.slice(0,8)==id){
								sum+=order.total
							}
						}
						mixdata[mixdata.length]=sum
						categories[categories.length]=(date.getMonth()+1)+'.'+date.getDate()
						//因数组数据的时间是从新到旧，为了从前到现在进行展示，需要倒序一下

					}
				}
				else if(selected===1 ||selected===2){//需查询月份数据时
					//计算本月每天的营业额，生成数组
					let monthrange=selected*2-1//为1时，在本月查询；为2时，在近三月
					for(let j=monthrange;j>0;j--){
						//获取当月日期
						let date=new Date()
						date.setMonth(nowDate.getMonth()-j+1)
						date.setDate(1)
						//获取当月最后一天
						y = date.getFullYear(), m = parseInt(date.getMonth()),d=date.getDate()
						lastDate = new Date(y, m+1, 0)
						lastDay=lastDate.getDate()
						//计算每月订单的总金额
						for(let i=1;i<=lastDay;i++){
							sum=0
							//计算id的日期
							date.setDate(i)
							y1 = date.getFullYear()
							m1 = this.full2(date.getMonth() + 1)
							d1 = this.full2(date.getDate())
							id = y1 + m1 + d1
							//计算当前号数的订单和
							for(let order of orders){
								if(order.id.slice(0,8)==id){
									sum+=order.total
								}
							}
							mixdata[mixdata.length]=sum
							categories[categories.length]=(date.getMonth()+1)+'.'+date.getDate()
						}

					}
				}
				else if(selected===3){//需查询历史数据时，计算全部历史数据
					id=orders[0].id
					let nextid=''//标识新的天数
					for(let order of orders){
						nextid=order.id
						sum+=order.total//计算当前订单的和
						//判断是否为新的天数。是，则将总数和天数保存到数组
						if(nextid.slice(0,8)!=id.slice(0,8)){
							console.log('id',id,'nextid',nextid)
							mixdata[mixdata.length]=sum
							categories[categories.length]=parseInt(id.slice(4,6))+'.'+id.slice(6,8)
							id=nextid
							sum=0
						}
					}
					//循环结束时，将最后循环的数据保存
					mixdata[mixdata.length]=sum
					categories[categories.length]=parseInt(id.slice(4,6))+'.'+id.slice(6,8)
					//因数组数据的时间是从新到旧，为了从前到现在进行展示，需要倒序一下
					mixdata.reverse()
					categories.reverse()
				}
				
				//更新canvas的line数据
				this.turnover_mix.data.categories=categories.slice(0)
				this.turnover_mix.data.series[0].data=mixdata.slice(0)
				console.log('mixdata:',mixdata)
				//简单计算利润值，供colmn数据
				for(let i in mixdata){
					mixdata[i]=Math.floor(mixdata[i]*0.6)
				}
				this.turnover_mix.data.series[1].data=mixdata.slice(0)
				console.log('categories',categories)
			},
		}
	}
</script>

<style lang="less">
	.flex-btwn{
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
	}


	.canvas-title{
		padding: .5vh 0;
		color: #fff;
		font-size: 6vw;
		font-weight: 600;
		text-align: center;
		background-color:#607a8e;
	}
	.canvas-nav{
		.flex-btwn();
		background-color: #7f98b1;
		justify-content: space-around;
		.turnover-sel{
			padding: 1vh 6vw;
			color: #fff;
		}
		.turnover-sel-active{
			color: #a2ceef;
			background-color: #fff;
		}
	}
	.canvas-ring{
		width: 100vw;
		height: 32vh;
	}
	.charts-mix{
		width: 100vw;
		height: 30vh;
	}
	
	/* .setpotions{
		margin: 1vh 0;
		.flex-btwn();
		justify-content: space-around;
		text-align: center;
		color: #fff;
		background:  #7f98b1;
		font-size: 4vw;
		.setpotions-nav{	
			padding: 0.4vh 2vw;
		}
		.setpotions-nav-hover{
			background: #495f69;
		}
		.i-opt{
			margin-left:.5vw;
		}
	} */
</style>
