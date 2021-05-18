<template>
	<view>
		<view class="reset">
			<view class="reset-current reset-view" @tap="resetStorage('current')">
				<view class="reset-title">重置当前数据</view>
				<view class="reset-detail">将对目前（2小时内）的订单集合进行清空，数据已同步保存到历史数据中。</view>
			</view>
			<view class="reset-today reset-view" @tap="resetStorage('today')">
				<view class="reset-title">重置今日数据</view>
				<view class="reset-detail">将对今日的订单集合进行清空，数据已同步保存到历史数据中。</view>
			</view>
			<view class="reset-history reset-view" @tap="resetStorage('history')">
				<view class="reset-title">重置历史数据</view>
				<view class="reset-detail">将对小程序缓存的全部订单数据进行清除，不可恢复，一般不要使用。</view>
			</view>
			<view class="reset-month reset-view" @tap="updateMonth">
				<view class="reset-title getmonth">计算本月数据</view>
				<view class="reset-detail">用于手动更新本月数据，到小程序缓存中。</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			full2(num) { //保留日期为2位数字符
				if (num < 10) return '0' + num
				else return num
			},
			resetStorage(date) {
				uni.showModal({
					title: '重置今日数据',
					content: '将重置本地数据，不可恢复，确定吗？',
					success(res) {
						if (res.confirm) {
							uni.setStorage({
								key: 'orderList_' + date,
								data: [],
								success(res) {
									uni.showToast({
										title: '重置成功！'
									})
								}
							})
						}
					}
				})
			},
			
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
				uni.showToast({
					title: '已更新本月数据'
				})
			},
		}
	}
</script>

<style lang="less">
	.reset-view{
		margin: 1vh 2vw;
		border-radius: 2vw;
		overflow: hidden;
		color: #ffffff;
		background-color: #798ea0;
	}
	.reset-title {
		margin-top: 2vh;
		box-sizing: border-box;
		padding:.5vh 2vw;
		font-size: 6vw;
		font-weight: 600;
		text-align: center;
		text-decoration: underline;
	}
	.reset-detail{
		padding: 2vw;
	}
</style>
