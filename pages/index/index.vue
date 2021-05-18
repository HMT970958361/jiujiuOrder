<template>
	<view class="logo-view">
		<image class="logo" src="/static/logo.svg"></image>
		<view class="logo-introduce">
			主营面食类、炒饭/盖饭、重庆砂锅米线。
		</view>
		<view class="logo-introduce">
			欢迎使用本小程序进行浏览、点餐。
		</view>
		<view class="setpotions">
			<view @tap="gotab('overview')" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-order2"></text>
					<text class="setpotions-title">经营状况</text>
			</view>
			<view @tap="gotab('orderState')" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-menu"></text>
					<text class="setpotions-title">订单管理</text>
			</view>
			<navigator @tap="gotab('orderMenu')" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-data"></text>
					<text class="setpotions-title">餐品管理</text>
			</navigator>
			<navigator url="../optionsData/optionsData" class="setpotions-nav" hover-class="setpotions-nav-hover">
					<text class="iconfont i-theme"></text>
					<text class="setpotions-title">数据管理</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '玖玖餐馆'
			}
		},
		methods: {
			gotab(tab){
				console.log('/pages/'+tab+'/'+tab)

				if(tab==3)uni.navigateTo({url:'../optionsData/optionsData'})
				else uni.switchTab({url: '/pages/'+tab+'/'+tab})
			},
		}
	}
</script>

<style lang="less">
	.flex-btwn{
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
	}
	.flex-col{
		//height: 90vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.logo-view{
		.flex-col();
	}
	.logo {
		height: 60vw;
		width: 80vw;
	}
	.logo-introduce{
		margin-top: 1vh;
		font-size: 4.5vw;
	}
	.setpotions{
		margin: 1vh 5vw;
		.flex-btwn();
		justify-content: space-around;
		text-align: center;
		color: #843939;
		//background:  #7f98b1;
		.setpotions-nav{
			.flex-col();
			width: 36vw;
			height: 36vw;
			margin: 2vh 0;
			font-size: 4vw;
			background: #e0e0e0;
			border-radius: 8vw;
			.iconfont{
				margin-bottom: 1vh;
				font-size: 10vw;
			}
		}
		.setpotions-nav-hover{
			color: #e86464;
		}
	}
</style>
