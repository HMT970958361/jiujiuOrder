<script>
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//初始化本地数据
			let storages=['current','today','month','history']
			for(let item of storages){
				if(!uni.getStorageSync('orderList_'+item))uni.setStorageSync('orderList_'+item,[])
				else console.log(item,'已存在:',uni.getStorageSync('orderList_'+item))
			}
		},
		onShow: function() {
			console.log('App Show')
			//判断上一次使用的时间，进行数据初始化
			let nowDate=new Date()
			let lastDate=new Date(uni.getStorageSync('lastDate'))
			let nowday=nowDate.getDate(),lastday=lastDate.getDate()+1
			if(!uni.getStorageSync('lastDate')){
				console.log('初始化运行时间')
				uni.setStorageSync('lastDate',nowDate.getTime())
			}
			else {
				if(lastday == nowday){
					uni.setStorageSync('orderList_today',[])
					console.log('今日数据已重置')
				}
				//当前时间比上一次打开的时间，超过2小时时，重置当前订单集。
				if((lastDate.getTime()+7200000) < nowDate.getTime()){
					uni.setStorageSync('lastDate',nowDate)
					uni.setStorageSync('orderList_current',[])
					uni.showToast({
						title:'距离上次使用已超过2小时，订单集已更新',
						icon:'none'
					})
				}
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("@/iconfont.wxss");
	.flex-center{
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
	}
	.txt-center{
		text-align: center;
	}
	.iebox{
		box-sizing: border-box;
	}
</style>
