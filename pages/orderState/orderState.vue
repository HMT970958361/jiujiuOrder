<template>
	<view>
		<view class="query">
			<view class="search">
				<picker class="search-date" mode="selector" :value="searchPicker.select" :range="searchPicker.range"
					@change="searchPickerChange">
					<view>{{searchPicker.range[searchPicker.select]}}<text class="iconfont i-arrow"></text></view>
				</picker>
				<view class="search-input">
					<text class="iconfont i-search"></text>
					<input class="search-input" type="text" :value="searchContent" @input="searchInput" />
				</view>
			</view>
			<view class="query-date" v-if="searchPicker.select==3">
				<text class="query-text">
					选择日期：
				</text>
				<view class="picker-date">
					<picker mode="date" :value="queryDate.start" @change="datePicker($event,'start')">
						<view>{{queryDate.start}}</view>
					</picker>
				</view>
				<text class="query-text">
					至
				</text>
				<view class="picker-date">
					<picker mode="date" :value="queryDate.end" @change="datePicker($event,'end')" >
						<view>{{queryDate.end}}</view>
					</picker>
				</view>
				<view class="query-text query-btn" hover-class="query-btn-hover" hover-stay-time=100 @tap="getOrderByDate(queryDate.start,queryDate.end)">
					查询
				</view>
			</view>
			<view class="filter">
				<view class="filter-items">
					<view v-for="(item,index) in filterNav.data" :key="item" @tap="filterChange(index)"
						class="filter-item" :class="filterNav.nowindex==index?'filter-selected':''"
					>
						<text>{{item}}</text>
						<text class="iconfont i-arrow"
							:class="filterNav.reverse && filterNav.nowindex==index?'filter-reverse':''"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="orders-null" v-if="orders.length==0&&filterNav.nowindex==0">
				暂无订单<br/>（最近2小时内）
		</view>

		<view v-if="filterNav.nowindex!=1" class="order-queue" v-for="(order,index) of orders" :key="order.id"
			:id="order.id">
			<view class="order-head">
				<view>
					<text>订单编号：</text>
					<text class="order-id">{{order.id}}</text>
				</view>
				<view>{{order.addtime.slice(-5)}}</view>
			</view>
			<view class="order-eidt">
				<view class="order-time" v-if="order.data.length>0">
					<view>点餐时间：{{order.addtime}}</view>
					<view>出餐时间：{{order.ordertime}}</view>
				</view>
				<view class="order-btns">
					<text class="order-btn btn-del" v-show="editorder!=order.id"  @tap="editDel(order)" >删除订单</text>
					<text class="order-btn btn-eidt-all" v-show="editorder!=order.id" @tap="goeditorder(order)">修改订单</text>
					<text class="order-btn btn-eidt" v-show="editorder!=order.id" @tap="eidtAble(order)">编辑状态</text>
					<text class="order-btn btn-save" v-show="editorder==order.id" @tap="editSave(order)">保存编辑</text>
					<text class="order-btn btn-cancel" v-show="editorder==order.id" @tap="editCancel(order.id,index)">取消编辑</text>
					<text class="order-btn iconfont i-arrow " @tap="editExtend(order.id)" v-show="order.data.length>2"></text>
				</view>
			</view>
			<!-- 			<view class="revoke" v-if="recoveryData.flag" @tap="revoke(order)">
				操作错误？点击此处撤销{{recoveryData.add?'本次添加':'本次删除'}}
			</view> -->
			<view class="orderisnull" v-if="order.data.length==0">
				尚未添加任何餐品
			</view>
			<scroll-view v-else scroll-y class="food-scrollview"
				:style="[order.data.length<3?{height:'unset;'}:{height:'38vh;'},editorder==order.id?{height:'unset;'}:{}]">
				<view class="food-view" :class="food.complete?'food-view-over':''" v-for="(food,index) in order.data"
					:key="index">
					<view class="food-head">
						<view class="food-id">
							<text>餐品编号：{{food.id}}</text>
							<text class="food-ispack" v-if="food.pepper=='打包'">{{food.pepper}}</text>
						</view>
						<view class="food-btn">
							<view class="food-complete" v-if="food.complete">
								<text v-if="food.complete">已完成</text>
								<text class="iconfont i-true"></text>
							</view>
							<view class="food-del" v-if="editorder==order.id" @tap="deleteFood(order,index)">
								<text>删除本餐</text>
								<text class="iconfont i-close"></text>
							</view>
						</view>
					</view>
					<view class="food-msg">
						<view class="food-msg-base">
							<text class="food-msg-base-name">{{food.heft.name}} : {{food.name}}</text>
							<text class="food-msg-base-other">{{food.flavor}} 、{{food.pepper}}</text>
						</view>
						<view class="food-msg-price">
							¥{{food.price}}
						</view>
					</view>
					<view class="food-note" v-if="food.note!=''">
						备注：{{food.note}}
					</view>
					<view class="food-state">
						<radio-group class="food-state-paymode" @change="editPayMode($event,food)">
							<label v-for="(paymode,index) in paymodes" :key="paymode">
								<text>{{paymode}}支付</text>
								<radio :value="paymode" :checked="food.paymode==paymode"
									:disabled="editorder!=order.id" />
							</label>
						</radio-group>
						<checkbox-group class="food-state-complete" @change="editState($event,food)">
							<label>
								<text>已付款：</text>
								<checkbox value="paid" :checked="food.paid" :disabled="editorder!=order.id" />
							</label>
							<label>
								<text>已出餐：</text>
								<checkbox value="made" :checked="food.made" :disabled="editorder!=order.id" />
							</label>
						</checkbox-group>
					</view>
				</view>
			</scroll-view>
			<view class="order-bottom">
				<view class="order-fast" v-show="editorder==order.id" @tap="fastComplete(order)">
					一键完成
				</view>
				<view class="totalprice" v-show="order.data.length!=0">
					<text>小计：</text>
					<text>¥{{order.total}}</text>
					<text style="font-size: 4vw;margin-left: 3vw;">(共{{order.data.length}}份餐)</text>
				</view>
			</view>
		</view>

		<view v-if="filterNav.nowindex===1" class="foodlists">
			<view class="foodlist" v-for="(item,key) in orderLists" :key="key">
				<view class="foodlist-name">
					<text class="iconfont" :class="'i-'+key"></text>
					<text>{{item.name}}</text>
				</view>
				<view class="foodlist-data" v-if="item.data.length>0">
					<view class="foodlist-food" v-for="(food,index) in item.data" :key="food.id"
						:class="food.made?'foodlist-food-made':''">
						<view>
							<view>
								<text>{{index+1}}.</text>
								<text>{{food.heft.name}}：{{food.name}}-{{food.flavor}}</text>
								<text>{{food.id.slice(8,10)}}:{{food.id.slice(10,12)}}</text>
								<text class="food-ispack" v-if="food.pepper=='打包'">{{food.pepper}}</text>
							</view>
						</view>
						<view class="food-state">
							<checkbox-group class="food-state-complete" @change="foodMadeChange($event,food)">
								<label>
									<text>已出餐：</text>
									<checkbox value="made" :checked="food.made" />
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
				<view v-else class="foodlist-isnull">
					————无————
				</view>
			</view>
		</view>
	</view>
</template>
<style lang="less">

</style>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				/* recoveryData: {
					flag: false,
					food: {},
					add: false,
					index: 0
				}, //撤销对selectFoods的删除操作或添加操作 */
				orders: [],
				editorder: '',
				editorderdata: {},
				paymodes: ['现金', '扫码'],
				searchPicker: {
					select: 0,
					range: ['当前', '今日','昨日', '历史订单']
				},
				searchContent: '',
				filterNav:{nowindex:0,reverse:false,data:['订单', '分类','未完成','已完成']},
				queryDate: {
					start: '',
					end: ''
				},
				orderLists: {//订单分类显示的数据集合
					noodle: {
						name: '面食类',
						data: []
					},
					rice: {
						name: '炒饭/盖饭',
						data: []
					},
					mixian: {
						name: '砂锅米线',
						data: []
					},
				},
				ordersCompleteOrNot:[]//订单完成或未完成的数据集合
			};
		},
		onShow() {
			this.setDateRange(this.searchPicker.select)
		},
		onPullDownRefresh() {
			this.setDateRange(this.searchPicker.select)
		},
		computed: {
			...mapState(['menuTypes']),
		},
		watch: {},
		methods: {
			//公共函数
			getcurrentOrder() { //获取当前本地数据
				uni.getStorage({
					key: 'orderList_current',
					success: res => {
						this.orders = res.data
						uni.stopPullDownRefresh()
					},
					fail() {
						uni.showToast({
							title: '当前暂无数据',
							icon: 'none'
						})
						uni.stopPullDownRefresh()
					}
				})
			},
			full2(num) { //保留日期为2位数字符
				if (num < 10) return '0' + num
				else return num
			},
			/* 历史订单查询 */
			searchInput(e) {//input输入
				let search=e.detail.value,
					searchorders=[]
				let orders=this.orders
				let str=''
				this.searchContent = search
				if(search!=''){
					for(let order of orders){
						for(let food of order.data){
							for(let key in food){
								str=str.concat(JSON.stringify(food[key]))
							}
							if(str.includes(search)){
								searchorders.push(JSON.parse(JSON.stringify(order)))
							}
							else str=''
							break
						}
					}
					this.orders=searchorders
					console.log(searchorders)
				}
				else this.setDateRange(this.searchPicker.select)
			},
			searchPickerChange(e) { //切换pikcer类型
				console.log('searchPicker类型：',e.detail.value)
				let select = e.detail.value
				this.searchPicker.select = select
				this.setDateRange(select)//切换pikcer类型后，更新orders
				this.filterNav.nowindex=0
			},
			datePicker(e, type) { //切换pikcer中的日期
				this.queryDate[type] = e.detail.value
				console.log(e.detail.value)
			},
			setDateRange(val) {//根据search类型，确定查询日期
				if (val == 0) this.getcurrentOrder() //当前的订单
				else {
					let start='',end=''
					let date = new Date()
					let [y1, m1, d1] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
					m1 = this.full2(m1)
					d1 = this.full2(d1)
					end = y1 + m1 + d1
					this.queryDate.end=y1+'-'+m1+'-'+d1
					if(val==1){//今天的订单
						this.queryDate.start=end
						start=end
/* 						this.orders=uni.getStorageSync('orderList_today')
						return ; */
					}
					else if(val==2){//昨天的订单
						date.setDate(date.getDate() - 1)
						let [y0, m0, d0] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
						m0 = this.full2(m0)
						d0 = this.full2(d0)
						start=end=y0+m0+d0
						this.queryDate.end=this.queryDate.start=y0+'-'+m0+'-'+d0
					}
					else if(val==3){//近一个月的订单
						date.setMonth(date.getMonth()-1)
						let [y0, m0, d0] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
						m0 = this.full2(m0)
						d0 = this.full2(d0)
						start=y0+m0+d0
						this.queryDate.start=y0+'-'+m0+'-'+d0
					}
					console.log('查询范围：',start,'-',end,this.queryDate)
					this.getOrderByDate(start, end)
				}
				},
			getOrderByDate(start,end) {//根据给定日期查询历史数据
				 //格式化日期
				let date0 = '',
					date1 = ''
				if (start.includes('-') && end.includes('-')) {//y-m-d格式
					let [y0, m0, d0] = start.split('-'), [y1, m1, d1] = end.split('-')
					date0 = parseInt(y0 + m0 + d0)
					date1 = parseInt(y1 + m1 + d1)
				} else {//20210101格式
					date0 = parseInt(start);
					date1 = parseInt(end)
				}
				if(date0<=date1){
					let data=uni.getStorageSync('orderList_history')
					let date=0
					let eligible = []
					for (let order of data) {
						date = parseInt(order.id.slice(0, 8))//取年月日
						if (date >= date0 && date <= date1)eligible.push(JSON.parse(JSON.stringify(order)))
					}
					if(date0==date1)uni.setStorageSync('orderList_today',eligible)
					this.orders = eligible
				}
				// uni.getStorage({//从历史数据中筛选
				// 	key: 'orderList_history',
				// 	success: (res) => {
				// 		let data = res.data,
				// 			date = 0,
				// 			eligible = []
				// 		for (let order of data) {
				// 			date = parseInt(order.id.slice(0, 8))//取年月日
				// 			if (date >= date0 && date <= date1)eligible.push(JSON.parse(JSON.stringify(order)))
				// 		}
				// 		if(date0==date1)uni.setStorageSync('orderList_today',eligible)
				// 		this.orders = eligible
				// 	}
				// })
				else uni.showToast({
					title:'日期范围错误',icon:'none'
				})
				uni.stopPullDownRefresh()
			},

			/* 过滤栏 */
			filterChange(index) {//切换filterNav时,计算一次过滤
				if (this.filterNav.nowindex != index) {
					this.filterNav.nowindex = index
					this.filterOrder(index)
				} else {
					this.filterNav.reverse = !this.filterNav.reverse
					this.orders.reverse()
				}
				
			},
			filterOrder(index){//根据过滤栏的选项进行过滤
				if (index == 0) {
					this.setDateRange(this.searchPicker.select)
				}
				else if (index == 1) {
					let foods = []
					this.orderLists.noodle.data = []
					this.orderLists.rice.data = []
					this.orderLists.mixian.data = []
					this.setDateRange(this.searchPicker.select)
					console.log('当前orders:',this.orders)
					for (let order of this.orders) { //将当前页的订单全部取出
						for (let food of order.data) {
							this.orderLists[food.type.en].data.push(JSON.parse(JSON.stringify(food)))
						}
					}
				
					function compare(prop) { //按对象id进行排序
						return function(obj1, obj2) {
							var val1 = parseInt(obj1[prop]);
							var val2 = parseInt(obj2[prop]);
							console.log(val1, val2)
							return val1 - val2;
						}
					}
				
					for (let key in this.orderLists) { //排序
						this.orderLists[key].data = this.orderLists[key].data.sort(compare("id"))
						console.log(this.orderLists[key].data)
						
					}
				}
				else if(index==2){
					this.setDateRange(this.searchPicker.select)
					let ordersNoComplete=[]
					let orders=this.orders
					for(let order of orders){
						for(let food of order.data){
							if(!food.complete){
								console.log(food.complete)
								ordersNoComplete.push(JSON.parse(JSON.stringify(order)))
								break
							}
						}
					}
					this.orders=ordersNoComplete
					console.log(ordersNoComplete)
				}
				else if(index==3){
					this.setDateRange(this.searchPicker.select)
					let ordersComplete=[]
					let orders=this.orders
					for(let order of orders){
						for(let food of order.data){
							if(food.complete){
								ordersComplete.push(JSON.parse(JSON.stringify(order)))
								break
							}
						}
					}
					this.orders=ordersComplete
					console.log(this.orders)
				}
			},

			/* 订单编辑 */
			eidtAble(order) {//点击编辑订单时，让当前order可编辑
				this.editorder = order.id
				this.editorderdata = JSON.parse(JSON.stringify(order))
				console.log('当前编辑的id:', order.id)
			},
			editSave(order) {//保存编辑
				this.$store.commit('updateOrder', {
					date: 'current',
					data: order
				}) //保存到今日数据
				this.$store.commit('updateOrder', {
					date: 'history',
					data: order
				}) //保存到历史数据
				this.editorder = ''
			},
			editCancel(orderid, index) {//取消编辑
				for (let item of this.orders) {
					if (item.id === orderid) {
						this.orders.splice(index, 1, JSON.parse(JSON.stringify(this.editorderdata)))
						this.editorderdata = {}
					}
				}

				console.log(this.orders[index])
				this.editorder = ''
			},
			editDel(order) {//删除订单
				uni.showModal({
					title: '删除订单',
					content: '确定删除本订单吗？',
					success: res => {
						if (res.confirm) {
							for(let i in this.orders){
								if(this.orders[i].id===order.id)
								this.orders.splice(i,1)
								break
							}
							this.$store.commit('delOrder', {
								date: 'current',
								data: order
							})
							this.$store.commit('delOrder', {
								date: 'history',
								data: order
							})
						}
					}
				})
			},
			goeditorder(order){
				this.$store.commit('editOrder',order)
				uni.switchTab({
					url:'../orderMenu/orderMenu'
				})
			},
			editExtend(id) { //当订单的餐品数大于2时，显示可展开按钮
				if (this.editorder == id) this.editorder = ''
				else this.editorder = id
			},
			
			/* 餐品编辑 */
			deleteFood(order, index) { //从订单中移除本餐品,将记录本次可撤销的行为
				let food = JSON.parse(JSON.stringify(order.data[index]))
				//let recoveryData = this.recoveryData
				uni.showModal({
					title: '移除此餐？',
					content: '将从本批次移除此餐',
					success: res => {
						if (res.confirm) {
							/* recoveryData.flag = true
							recoveryData.food = JSON.parse(JSON.stringify(food))
							recoveryData.add = false
							recoveryData.index = index */
							order.data.splice(index, 1)
							this.$store.commit('updateOrder', {
								date: 'current',
								data: order
							})
							this.$store.commit('updateOrder', {
								date: 'history',
								data: order
							})
							//console.log(recoveryData)
							let sum = 0

							if (order.data.length > 0) {
								for (let food of order.data) {
									sum += parseFloat(food.price)
								}
							}
							order.total = sum
						}
					},
				})
			},
			editPayMode(e, food) {//编辑支付方式
				console.log(e.detail.value)
				food.paymode = e.detail.value
			},
			editState(e,food) {//编辑餐品状态
				let values = e.detail.value
				food.paid = food.made = false
				if(values.length>0)for (let item of values)food[item] = true
				food.complete = food.paid && food.made
			},
			fastComplete(order){
				for(let food of order.data){
					food.paid=food.made=food.complete=true
					food.paymode='现金'
				}
				this.editSave(order)
			},
			/* 操作步骤保存-仅限一步 */
			/* 			revoke(order) { //撤销上一次的操作
				let reset = () => {
					this.recoveryData.flag = false
					this.recoveryData.food = {}
					this.recoveryData.add = false
					this.recoveryData.index = 0
				}
				if (this.recoveryData.flag) {
					if (!this.recoveryData.add) {
						order.data.splice(this.recoveryData.index, 0, this.recoveryData.food)
						let sum = 0
						if (order.data.length > 0) {
							for (let food of order.data) {
								sum += parseFloat(food.price)
							}
						}
						order.total = sum
						reset()
						uni.showToast({
							title: '已撤销删除'
						})

					} else if (this.recoveryData.add) {
						order.data.shift(0, 1)
						reset()
						uni.showToast({
							title: '已撤销添加'
						})
					}
				}
			}, */
			
			/* 过滤栏-列表 */
			foodMadeChange(e,food){//保存列表的'已出餐'勾选状态
				this.editState(e,food)
				this.$store.commit('updateFood',{
					date: 'current',
					data: food
				})
				this.$store.commit('updateFood',{
					date: 'history',
					data: food
				})
			}
		}
	}
</script>

<style lang="less">
	.txt-center {
		text-align: center;
	}

	.iebox {
		box-sizing: border-box;
	}

	.flex-center {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
	}

	.flex-start {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	.flex-end {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-end;
		align-items: center;
	}

	.flex-btwn {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.radius {
		padding: .5vh 2vw;
		border-radius: 1vw;
	}

	/* 筛选与检索 */
	.query{
		padding: 0 2vw;
	}
	.search {
		box-sizing: border-box;
		.flex-start();
		border: 1px solid #6490b1;
		border-radius: 8vw;
		overflow: hidden;
		.search-date {
			height: 5vh;
			width: 26vw;
			font-size: 4vw;
			line-height: 5vh;
			text-align: center;
			background-color: #607a8e;
			color: #fff;

			.i-arrow{
				margin-left: 1vw;
			}
		}

		.search-input {
			.flex-start();
			height: 5vh;
			flex: auto;

			.i-search {
				font-size: 3.5vh;
				padding: 0 2vw;
				border-right: 1px solid #607a8e;
			}

			.search-input {
				padding: 2vw;
				border: none;
			}
		}
	}

	.query-date {
		box-sizing: border-box;
		margin: 2vh 2vw;
		.flex-start();
		justify-content: space-around;
		.query-text {
			font-size: 4vw;
		}
		.query-btn{
			background: #00a6e4;
			border-radius: 1vw;
			padding: 0.5vh 2vw;
			color: #fff;
		}
		.query-btn-hover{
			background: #14d8ff;
		}
		.picker-date {
			margin: 0 2vw;
			border: 1px solid #8a8a8a;
			border-top:none;
			border-left: none;
			border-right: none;
			color: #059dbf
		}

	}

	.filter {
		margin: 1vh 0;
		background-color: #484848;
		border-radius: 2vw;
		overflow: hidden;
		.filter-items {
			.flex-btwn();
			.filter-item {
				padding: 1vh 4vw;
				.flex-center();
				font-size: 3.6vw;
				color: #fff;
				transition: all .5s;
				.i-arrow {
					margin-left: 1vw;
				}
			}

			.filter-selected {
				background-color: #607a8e;
			}

			.filter-reverse {
				display: inline-block;
				transform: rotate(180deg);
			}
		}
	}

	/* 队列为空时提示文字 */
	.orders-scorll {
		height: 100vh;
	}

	.orders-null {
		font-size: 6vw;
		text-align: center;
		padding: 36vh 0;
		vertical-align: middle;
	}

	/* 待出餐队列 */
	.order-queue {
		box-sizing: border-box;
		padding: 0.5vh 1vw;
		margin: 0.5vh 2vw;
		border-radius: 2vw;
		transition: all .5s;
		background-color: #484848;
	}

	.order-head{
		.flex-btwn();
		padding: 1vh 1vw;
		color: #fff;
		border-bottom: 1px solid #8e8e8e;
		font-size: 6vw;
		font-weight: 600;
		.order-id{
			font-size: 4vw;
		}
		
	}
	.order-eidt{
		.flex-btwn();
		.order-time {
			margin-top: .5vh;
			padding: .5vh 1vw;
			font-size: 3vw;
			color: #fff;
		}
		.order-btns {
			padding: 1vh 0;
			color: #fff;
			font-size: 3vw;
			.flex-end();
			.order-btn {
				padding: 1vw;
				margin: 0 .5vw;
				border-radius: 3px;
				font-size: 3vw;
				line-height: 5vw;
				background-color: #00dcff;
			}
			.btn-eidt{
				background-color:#00dcff;
			}
			.btn-eidt-all{
				color: #000;
				background-color: #fff936;
			}
			.btn-del {
				color: #fff;
				background-color: #c52b2b;
			}
			.btn-save {
				color: #000;
				background-color: #fff936;
			}
			.btn-cancel{
				color: #000;
				background-color: #56ff72;
			}

		}

	}

	/* 	.revoke {
		padding: 1vh 0;
		color: #fff;
		font-size: 4vw;
		text-align: center;
		text-decoration: underline #fff;
	} */

	.orderisnull {
		text-align: center;
		color: #2b2b2b;
		background-color: #f3f3f3;
		border-radius: 1vw;
		padding: 2vh 0;
	}

	/* 餐品卡片 */
	.food-scrollview {
		height: 37vh;
		box-sizing: border-box;
	}

	.food-view {
		.radius();
		margin-top: 1vh;
		padding: 0.5vh 3vw;
		background-color: #fbfbfb;

		.food-head {
			height: 8vw;
			.flex-btwn();
			    
			.food-id {
				font-size: 3.2vw;
			}
			.food-ispack{
				margin-left: 3vw;
				padding: 0.2vh 3vw;
				border-radius: 5vw;
				color: #ffffff;
				background-color: #e24f4f;	
			}
			.food-btn {
				.flex-end();
				.food-complete {
					line-height: 6vw;
					padding: 1vw;
					.radius();
					.flex-btwn();
					font-size: 3vw;
					color: #fff;
					background-color: #00b2ce;
				}
				.food-del {
					line-height: 6vw;
					padding: 1vw;
					margin: 0 .5vw;
					border-radius: 3px;
					font-size: 3vw;
					color: #fff;
					line-height: 5vw;
					background-color: #c52b2b;
				}
				.i-close {
					font-size: 3vw;
				}
			}
		}

		.food-msg {
			.flex-btwn();
			margin: 1vh 0;
			padding-top: 1vh;
			border-top: 1px solid #00b2ce;

			.food-msg-base {
				.food-msg-base-name {
					font-size: 5vw;
					color: #00b2ce;
				}

				.food-msg-base-other {
					margin-left: 3vw;
					font-size: 3vw;
					color: #009bb3;
				}
			}

			.food-msg-price {
				font-size: 7vw;
				color: #009bb3;
			}
		}

		.food-note {
			padding-bottom: 1vh;
			margin-bottom: 1vh;
			border-bottom: 1px solid #00b2ce;
		}

		.food-state {
			.flex-btwn();

			.food-state-paymode {
				.flex-end();
				font-size: 3vw;
			}

			.food-state-complete {
				.flex-end();
				font-size: 3vw;
			}
		}
	}

	.food-view-over {
		opacity: 0.5;
	}

	.order-bottom{
		margin: 1vh 0;
		.flex-end();
		.order-fast{
			padding: .5vh 10vw;
			color: #fff;
			background: #67a93f;
			border-radius: 1vw;
			margin-right: 5vw;
		}
		.totalprice {
			font-size: 6vw;
			color: #fff;
			text-align: end;
		}
	}





	/* 列表视图 */
	.foodlists {
		    margin: 1vh 1vw;
	}

	.foodlist-isnull {
		text-align: center;
	}

	.foodlist {
		border-radius: 2vw;
		margin-top: 4vh;
	}
	.foodlist-name{
		font-size: 5vw;
		font-weight: 600;
		margin-left: 2vw;
		.iconfont{
			font-size: 6vw;
		}
	}
	.foodlist-data {
		font-size: 4vw;
		.foodlist-food {
			font-size: 3.6vw;
			.flex-btwn();
			padding: .5vh 1vw;
			margin: .5vh 1vw;
			border-radius: 1vw;
			background: #6490b1;
			color: #fff;
		}
		.foodlist-food-made{
			opacity: 0.2;
		}
		.food-state {
			font-size: 3vw;
		}
		.food-ispack{
			margin-left: 3vw;
			padding: 0.2vh 3vw;
			border-radius: 5vw;
			font-size: 3vw;
			color: #ffffff;
			background-color: #e24f4f;	
		}
	}
</style>
