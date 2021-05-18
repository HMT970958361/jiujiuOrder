<template>
	<view>
		<view class="menu">
			<view class="menu-types">
				<view :class="nowType.en==type.en?'now-type':''" class="menu-type"  v-for="(type,index) in menuTypes" :key="type.name" @tap="typeChange(type.en,index)">
					<text class="iconfont icon" :class="type.icon"></text>
					<text class="menu-type-txt">{{type.name}}</text>
					<text class="iconfont i-arrow-r"></text>
				</view>
			</view>
			<scroll-view class="menu-foods" :style="foodAttr.show?'height: 39vh;':'height: 94.5vh;'" scroll-y :scroll-into-view="nowType.en">
				<view v-for="(foods,index) of menuFoods" :key="foods.type">
					<view class="food-type" :id="foods.type">
						<view class="menu-type">
							<text class="iconfont icon" :class="foods.icon"></text>
							<text class="menu-type-txt">{{foods.name}}</text>
						</view>
					</view>
					<view class="food" v-for="food in foods.data" :key="food.name">
						<view class="food-name" @tap="choosefood(food,foods.type,index)" hover-class="food-name-hover" hover-stay-time=100>
							{{food.name}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="food-attributes" :style="foodAttr.style">
			<view class="attributes-msg">
				<view class="attribute-title">
					<view v-if="selectFood.name==''">请选择餐品</view>
					<view else>{{selectFood.name}}</view>
					<view v-if="selectFood.price>0" style="margin-left: 4vw;">¥{{selectFood.price}}</view>
				</view>
				<view class="attribute-heft">
					<radio-group class="radio-group" name="foodHeft" @change="heftChange">
						<label v-for="heft in menuFoods[nowType.index].heft" :key="heft.name">
							<text>{{heft.name}}</text><radio class="radio" :value="heft.tag" :checked="heft.tag === selectFood.heft.tag" :disabled="selectFood.name==''"/>
						</label>
					</radio-group>
					<view class="heft-other">
						<view class="attr-input">
							<text>分量：</text><input :value="heft.name" @input="attrInput($event,'heft')" :disabled="selectFood.name==''"/>
						</view>
						<view class="attr-input" >
							<text>金额：</text><input  type="number" :value="selectFood.price" @input="inputPrice"/>
						</view>
					</view>
				</view>
				<view class="attr-other" :style="foodAttr.show?'':'flex-flow: column;'">
					<view class="attribute-flavor">
						<radio-group class="radio-group" name="foodFlavor" @change="flavorChange">
							<label v-for="flavor in menuFoods[nowType.index].flavor" :key="flavor">
								<text>{{flavor}}</text><radio class="radio" :value="flavor" :checked="flavor === selectFood.flavor" :disabled="selectFood.name==''"/>
							</label>
						</radio-group>
						<view class="attr-input">
							<text>口味：</text><input :value="selectFood.flavor" @input="attrInput($event,'flavor')" :disabled="selectFood.name==''"/>
						</view>
					</view>
					<view class="attribute-pepper">
						<radio-group class="radio-group" name="foodPepper" @change="pepperChange">
							<label v-for="pepper in menuFoods[nowType.index].pepper" :key="pepper">
								<text>{{pepper}}</text><radio class="radio" :value="pepper" :checked="pepper === selectFood.pepper" :disabled="selectFood.name==''"/>
							</label>
						</radio-group>
						<view class="attr-input">
							<text>就餐：</text><input :value="selectFood.pepper" @input="attrInput($event,'pepper')" :disabled="selectFood.name==''"/>
						</view>
					</view>
				</view>
				
				<view class="attribute-note">
					备注：<input class="attribute-note-input" type="text" :value="selectFood.note" @input="foodNote" :disabled="selectFood.name==''"/>
				</view>
				<view class="add-food" hover-class="add-food-hover" hover-stay-time=100 @tap="addFood" :style="isNaN(selectFood.price)||selectFood.price==0?'filter: opacity(0.5);':''">
					添加
				</view>
				<view class="add-order" hover-class="add-order-hover" hover-stay-time=100 @tap="addOrder" :style="selectFoods.total==0?'filter: opacity(0.5);':''">
					保存订单
				</view>
				<view class="reset-attr" hover-class="reset-attr-hover" hover-stay-time=100 @tap="resetAttr" :style="selectFood.name==''?'filter: opacity(0.5);':''">
					重置选项
				</view>
			</view>
			<view class="attribute-drawer iconfont i-arrow" :class="foodAttr.show?'arrow-left':'arrow-right'"  :style="orderQueue.show?'align-self:flex-start;margin-top: 1.5vh;':''" @tap="showfoodAttr">
			</view>
		</view>
		<view class="order-view"  :style="orderQueue.style">
			<view class="order-id" @tap="showqueue">
				<text class="order-id-text" v-if="selectFoods.data.length>0">订单编号：{{selectFoods.id}}</text>
				<text class="iconfont i-arrow" :class="orderQueue.show?'arrow-down':'arrow-up'" ></text>
			</view>
			<view class="order-save" @tap="saveOrder" v-if="selectFoods.data.length!=0 && !isEdit">生成订单</view>
			<view class="edit-order" v-else-if="isEdit">
				<text class="edit-order-save" @tap="saveOrder">保存编辑</text>
				<text class="edit-order-cancel" @tap="editCancel">取消编辑</text>
			</view>
			
			
			<!-- 			<view class="revoke" v-if="recoveryData.flag" @tap="revoke">
				操作错误？点击此处撤销{{recoveryData.add?'本次添加':'本次删除'}}
			</view> -->
			<view class="selectfoods-null" v-if="selectFoods.data.length==0">
				尚未添加任何餐品
			</view>
				<view class="order-time" v-if="selectFoods.data.length>0">
					<view>点餐时间：{{selectFoods.addtime}}</view>
					<view>预计出餐时间：{{selectFoods.ordertime}}</view>
				</view>
			<scroll-view v-if="selectFoods.data.length>0" scroll-y class="food-scrollview">
				<view class="food-view" :class="food.complete?'food-view-over':''" v-for="(food,index) in selectFoods.data" :key="index">
					<view class="food-head">
						<view class="food-id">
							<text>餐品编号：{{food.id}}</text>
						</view>
						<view class="food-btn">
							<view class="food-complete" v-if="food.complete">
								<text v-if="food.complete">已完成</text>
								<text class="iconfont i-true"></text>
							</view>
							<view class="food-del" v-if="editorder==order.id" @tap="removeFood(index)">
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
						<radio-group class="food-state-paymode" @change="payMode($event,food)">
							<label v-for="(paymode,index) in paymodes" :key="paymode">
								<text>{{paymode}}支付</text><radio :value="paymode" :checked="food.paymode==paymode"/>
							</label>
						</radio-group>
						<checkbox-group class="food-state-complete" @change="foodState($event,food)">
							<label>
								<text>已付款</text><checkbox value="paid" :checked="food.paid" />
							</label>
							<label>
								<text>已出餐</text><checkbox value="made" :checked="food.made"/>
							</label>
						</checkbox-group>
					</view>

				</view>
			</scroll-view>
			<view class="order-totalprice" v-if="selectFoods.data.length!=0">
				<text>小计：</text>
				<text>¥{{selectFoods.total}}</text>
				<text style="font-size: 4vw;margin-left: 3vw;">(共{{selectFoods.data.length}}份餐)</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				orderQueue:{show:false,style:'height:5vh;'},
				foodAttr:{show:true,style:'width: 96vw;height:55vh;'},
				//heftInput:false,
				inputheft:'',
				nowType:{index:0,name:'面食类',en:'noodle',icon:'i-mian'},
				paymodes:['现金','扫码'],
				//recoveryData:{flag:false,food:{},add:false,index:0},//撤销对selectFoods的删除操作或添加操作
				selectFood:{id:'',prices:{},type:{index:0,en:'noodle'},name:'',heft:{name:'',tag:''},flavor:'',pepper:'',price:0,note:'',paymode:'',paid:false,made:false,complete:false},
				selectFoods:{
					addtime:'',
					ordertime:'',
					id:'',
					total:0,
					data:[]
				},
				isEdit:false
			};
		},
		onShow() {
			if(this.editOrder.id!=''){
				console.log(this.editOrder)
				this.isEdit=true
				this.foodAttr.show=false
				this.orderQueue.show=true
				this.selectFoods=this.editOrder
				console.log(this.selectFoods)
			}
		},
		computed:{
			...mapState(['menuTypes','menuFoods','editOrder'])
		},
		watch:{
			'selectFood.heft.tag':{
				handler:function(name){
					this.setprice()
				}
			},
			'orderQueue.show':{
				handler:function(val){
					console.log()
					if(val)this.orderQueue.style='height:64vh;'
					else this.orderQueue.style='height:5vh;'
				}
			},
			'foodAttr.show':{
				handler:function(val){
					console.log()
					if(val)this.foodAttr.style='width: 96vw;height: 55vh;'
					else this.foodAttr.style='width: 45vw;height: 94.5vh;'
				}
			},
			'selectFoods.data.length':{
				handler:function(length){
					let sum=0
					if(length>0){
						for(let food of this.selectFoods.data){
							sum+=parseFloat(food.price)
						}
					}
					this.selectFoods.total=sum
				}
			}
		},
		methods:{
			typeChange(type,index){
				for(let i in this.menuFoods){
					if(this.menuFoods[i].type==type){
						this.nowType.name=this.menuFoods[i].name
						this.nowType.index=i
						this.nowType.en=type
						for(let type of this.menuTypes){
							if(type.en===type)this.nowType.icon=type.icon
						}
						return ;
					}
				}
				/* this.nowType.en=type
				this.nowType.index=index
				this.nowType.icon=icon */
				this.selectFood.type.en=this.nowType
				this.selectFood.type.index=index
				this.orderQueue.show=false
				//this.foodAttr.show=false
				this.resetAttr()
			},
			choosefood(food,type,index){
				/* 点击新餐品类型时,设置当前餐品类型 */
				if(type!=this.nowType.en){
					for(let i in this.menuFoods){
						if(this.menuFoods[i].type==type){
							this.nowType.name=this.menuFoods[i].name
							this.nowType.index=i
							this.nowType.en=type
							for(let type of this.menuTypes){
								if(type.en===type)this.nowType.icon=type.icon
							}
							break
						}
					}
				}
				/* 添加当前餐品到属性选择块 */
					this.selectFood.prices=JSON.parse(JSON.stringify(food.price))
					this.selectFood.type.en=type
					this.selectFood.type.index=index
					this.resetAttr()
					this.selectFood.name=food.name
					this.setprice()

				this.orderQueue.show=false
				console.log(this.selectFood)
			},
			heftChange(e){
				this.selectFood.heft.tag=e.detail.value
				console.log(this.selectFood.heft)
			},
			flavorChange(e){
				this.selectFood.flavor=e.detail.value
			},
			pepperChange(e){
				this.selectFood.pepper=e.detail.value
			},
			setprice(){
				for(let foods of this.menuFoods){
					if(this.selectFood.type.en===foods.type){
						for(let heft of foods.heft){
							if(this.selectFood.heft.tag===heft.tag){
								this.selectFood.heft=JSON.parse(JSON.stringify(heft))
								this.selectFood.price=this.selectFood.prices[this.selectFood.heft.tag]
								console.log(this.selectFood.price,'元')
								return ;
							}
						}
					}
				}
			},
			foodNote(e){
				this.selectFood.note=e.detail.value
			},
			addFood(){
				
				function full2(num){if(num<10){return '0'+num;}else return num;}//生成两位字符格式
				/* 判断餐品名、自定义份量和金额是否正确的输入 */
				if(this.selectFood.name==''){uni.showToast({title:'请选择餐品',icon:'none'});return;}
				if(this.selectFood.heft.tag=='' && this.selectFood.heft.name==''){
					uni.showToast({title:'请选择份量',icon:'none'})
					return ;
				}
				console.log(typeof this.selectFood.price)
				if(isNaN(this.selectFood.price)){
					uni.showToast({title:'请输入金额',icon:'none'})
					return ;
				}
				/* 调整餐品的名称 */
				let fname=this.selectFood.name
				let ftype=this.selectFood.type.en
				console.log( '当前类型：',this.selectFood.type)
				if(ftype=='noodle')fname=this.selectFood.name;
				else if(ftype=='rice'){
					console.log('是rice')
					if(fname.includes('炒饭'))fname=fname.replace('炒饭',this.selectFood.heft.name);
					else if(fname.includes('盖饭'))fname=fname.replace('盖饭',this.selectFood.heft.name);
				}
				else if(ftype=='mixian'){
					console.log('是mixian')
					if(fname.includes('三鲜'))fname=fname.replace('炒饭',this.selectFood.flavor);
					else if(fname.includes('酸辣'))fname=fname.replace('酸辣',this.selectFood.flavor);
				}
				this.selectFood.name=fname
				console.log(fname)
				/* 生成订单、餐品编号 */
				let date = new Date()
				if(!this.isEdit){//未处于编辑状态时，更新订单编号
					let id=date.getFullYear().toString()+full2(date.getMonth()+1)+full2(date.getDate())+full2(date.getHours())+full2(date.getMinutes())+full2(date.getSeconds())
					this.selectFoods.id=id
					this.selectFood.id=id+this.selectFoods.data.length
				}

				
				/* 生成餐品时间戳 */
				this.selectFoods.addtime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+full2(date.getHours())+':'+full2(date.getMinutes())
				date.setMinutes(date.getMinutes()+10)
				this.selectFoods.ordertime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+full2(date.getHours())+':'+full2(date.getMinutes())
				/* 将餐品推到订单中 */
				this.selectFoods.data.unshift(JSON.parse(JSON.stringify(this.selectFood)))
				/* 保存此步新增餐品操作，以供撤销 */
				/* this.recoveryData.flag=true
				this.recoveryData.food=JSON.parse(JSON.stringify(this.selectFood))
				this.recoveryData.add=true
				this.recoveryData.index=0 */
				/* 收起操作栏 */
				this.orderQueue.show=false,
				//this.foodAttr.show=false,
				uni.showToast({title:'已添加'})
				
				//console.log(this.recoveryData)
			},
			addOrder(){
				if(this.selectFoods.data.length>0){
					uni.showModal({
						title:'创建新订单',
						content:'当前订单将自动保存，是否创建新订单？',
						success:res=>{
							if(res.confirm){
								this.saveOrder()
								uni.showToast({title:'订单已保存',icon:'success'})
							}
						}
					})
				}
				else uni.showToast({
					title:'订单为空',icon:'none'
				})
			},
			attrInput(e,type){
					if(type=='heft'){
						this.selectFood.heft.name=e.detail.value
						this.selectFood.heft.tag=''
					}
					else this.selectFood[type]=e.detail.value
					console.log(this.selectFood[type])
			},
			resetAttr(){
				this.selectFood.name=''
				this.selectFood.heft.name=this.menuFoods[this.selectFood.type.index].heft[0].name
				this.selectFood.heft.tag=this.menuFoods[this.selectFood.type.index].heft[0].tag
				this.selectFood.flavor=this.menuFoods[this.selectFood.type.index].flavor[0]
				this.selectFood.pepper=this.menuFoods[this.selectFood.type.index].pepper[0]
				this.selectFood.price=0
				this.selectFood.note=''
				this.selectFood.paid=false
				this.selectFood.made=false
				this.heftInput=''
			},
			inputPrice(e){
				let price = e.detail.value
				price=parseFloat(price)
				if(typeof price =='number'){
					price.toFixed(2)
					this.selectFood.price=price
				}
				else uni.showToast({
					title:'请输入正确的数值',
					icon:'none'
				})
			},
			foodState(e,food){
				let values = e.detail.value
				food.paid=food.made=false
				if(values.length>0)for(let item of values)food[item]=true
				food.complete=food.paid && food.made
			},
			payMode(e,food){
				console.log(e.detail.value)
				food.paymode=e.detail.value
			},
			
			removeFood(index){
				let food=JSON.parse(JSON.stringify(this.selectFoods.data[index]))
				let selectFoods= this.selectFoods
				//let recoveryData = this.recoveryData
				uni.showModal({
					title:'移除此餐？',
					content:'将从本批次移除此餐',
					success(res) {
						if(res.confirm){
								/* recoveryData.flag=true//记录上一步操作。暂不使用。
								recoveryData.food=JSON.parse(JSON.stringify(food))
								recoveryData.add=false
								recoveryData.index=index */
								selectFoods.data.splice(index,1)
								uni.showToast({title:'已移除该餐'})
								//console.log(recoveryData)
						}
					},
				})
			},
			/* revoke(){//撤销上一步操作。暂不使用。
				let reset=()=>{
					this.recoveryData.flag=false
					this.recoveryData.food={}
					this.recoveryData.add=false
					this.recoveryData.index=0
				}
				if(this.recoveryData.flag){
					if(!this.recoveryData.add){
						this.selectFoods.data.splice(this.recoveryData.index,0,this.recoveryData.food)
						reset()
						uni.showToast({title:'已撤销删除'})
					}
					else if(this.recoveryData.add){
						this.selectFoods.data.shift(0,1)
						reset()
						uni.showToast({title:'已撤销添加'})
					}
				}
			}, */
			showqueue(){
				this.foodAttr.show=false
				this.orderQueue.show=!this.orderQueue.show
			},
			showfoodAttr(){
				this.foodAttr.show=!this.foodAttr.show
				this.orderQueue.show=false
			},
			saveOrder(){
				if(this.isEdit)this.updateOrder()//更新编辑的order订单
				else {
					/* 保存到今日数据，和本地历史数据 */
					let order=JSON.parse(JSON.stringify(this.selectFoods))//防止数据重置操作在下下面的异步操作前执行
					this.$store.commit('saveOrder',{date:'current',data:order})//保存到当前数据
					this.$store.commit('saveOrder',{date:'today',data:order})//保存到当前数据
					this.$store.commit('saveOrder',{date:'history',data:order})//保存到历史数据
					this.orderQueue.show=false
					this.selectFoods={addtime:'',ordertime:'',id:'',data:[]}
				}

				
				/* this.recoveryData.flag=false
				this.recoveryData.food={}
				this.recoveryData.add=false
				this.recoveryData.index=0 */
			},
			updateOrder(){
				console.log(this.selectFoods)
				let order=JSON.parse(JSON.stringify(this.selectFoods))//防止数据重置操作在下下面的异步操作前执行
				this.$store.commit('updateOrder',{date:'current',data:order})
				this.$store.commit('updateOrder',{date:'today',data:order})
				this.$store.commit('updateOrder',{date:'history',data:order})
				
				/* this.selectFoods.addtime=''
				this.selectFoods.ordertime=''
				this.selectFoods.id=''
				this.selectFoods.data=[] */
				this.isEdit=false
				this.foodAttr.show=false
				this.orderQueue.show=false
				this.$store.commit('resetOrder')
				this.selectFoods={addtime:'',ordertime:'',id:'',data:[]}
			},
			editCancel(){
				
				this.isEdit=false
				this.foodAttr.show=false
				this.orderQueue.show=false
				this.$store.commit('resetOrder')
				this.selectFoods={addtime:'',ordertime:'',id:'',data:[]}
			}
		}
	}
</script>

<style lang="less">
/* 公共样式 */
.txt-center{
	text-align: center;
}
.iebox{
	box-sizing: border-box;
}
.flex-center{
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-items: center;
}
.flex-start{
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
}
.flex-end{
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
}
.flex-btwn{
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
}
.radius{
	padding:.5vh 1vw;
	border-radius: 1vw;
}
.text-clipcolor{
	color: transparent;
	background-image:linear-gradient(#000,#f00,#000);
	background-clip: text;
}


.i-arrow{
	color:#00dcff;
}
.arrow-up{
	transform: rotate(180deg);
}
.arrow-down{
	transform: rotate(0deg);
}
.arrow-left{
	transform: rotate(90deg) !important;
}
.arrow-right{
	transform: rotate(-90deg) !important;
}

/* 菜单 */
.menu{
	height: 39vh;
	padding: 0 2vw;
	background-color: #f9f9f9;
	.flex-btwn();
	align-items: flex-start;
}
/* 菜单大类 */
.menu-types{
	width: 40vw;
	height: 39vh;
	border-radius: 1vw;
	overflow: hidden;
	background-color: #2c2c2c;
	color:#fff;
	.menu-type{
		.flex-start();
		justify-content: center;
		padding: .7vh 1vw;
		font-size: 4vw;
		text-align-last:justify;//两端对齐
		transition: all .5s;
		.icon{
			font-size: 10vw;
		}
		.menu-type-txt{
			margin: 0 2vw;
			width: 18vw;
		}
	}
	.now-type{
		color: #05deff;
		background-color: #000;
	}
}

/* 餐品滚动视图 */
.menu-foods{
	width: 50vw;
	height: 94.5vh;
	border-radius: 1vw;
	overflow: hidden;
	transition: all .5s;
	.food-type{
		font-size: 4vw;
		color: #fff;
		background-color: #232323;
		text-align: center;
		padding: 1.6vh 1vw;
		border-radius: 0vw;
		margin-bottom: 0.5vh;
	}
	.food{
		.food-name{
			font-size: 4vw;
			background-color: #748c9a;
			text-align: center;
			padding: 1vh 1vw;
			border-radius: 1vw;
			margin-bottom: 0.2vh;
			color: #fff;
		}
		.food-name-hover{
			background-color:#bae1f7;
		}
	}
}

/* 餐品属性选择 */
.food-attributes{
	.flex-center();
	width: 96vw;
	height: 55vh;
	margin: 0 2vw;
	padding: 0 0 1vh 5vw;
	box-sizing: border-box;
	position: absolute;
	z-index:100;
	bottom: 5.5vh;
	transition: all .5s;
	font-size: 3vw;
	background: #2b2b2b;
	border-radius: 1vw;
	.attributes-msg{
		flex:auto;
	}
	.attribute-drawer{
		font-size: 8vw;
		transform: rotate(-90deg);
	}
	.attribute-title{
		padding:1vh 1vw;
		font-size:4vw;
		color: #fff;
		.flex-center();
		justify-content: space-between;
	}
	.radio-group{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: flex-start;
	}
		.radio{
			transform: scale(0.8);
			margin-right: 2vw;
		}
		.attr-input{
			margin-top:1vh;
			.flex-start();
			input{
				.radius();
				width: 14vw;
				padding:.2vh 1vw;
				margin-left:1vw;
				border: 1px solid #0fa2b9;
			}
		}
		.input-price{
			.flex-start();
			font-size: 3vw;
			input{
				width: 28vw;
				.radius();
				padding:.2vh 2vw;
			}
		}
		.attribute-heft
		{
			.radius();
			margin-bottom:1vh;
			background-color: #fff;
		}
		.heft-other{
			display: flex;
			flex-flow: row wrap;
			align-items: center;
			justify-content: space-between;
		}
		.attr-other{
			.flex-btwn();
			.radius();
			margin-bottom:1vh;
			background-color: #fff;
		}
		.attr-other-shut{
			flex-flow: column;
		}
		.attribute-note{
			font-size: 3vw;
			.radius();
			background-color: #fff;
			.attribute-note-input{
				.radius();
				margin-top:1vh;
				background-color: #fff;
				border: 1px solid #0fa2b9;
			}
		}
		.add-food{
			margin-top: 1vh;
			padding:1vw;
			.txt-center();
			font-size: 4vw;
			color:#fff;
			background-color:#0fa2b9;
			border: .3vw solid #000;
			border-radius: 1vw;
		}
		.add-food-hover{
			background-color:#12c9e5;
		}
		.add-order{
			.add-food();
			color:#fff;
			background-color: #01608e;
		}
		.add-order-hover{
			background-color:#0094d8;
		}
		.reset-attr{
			.add-food();
			color:#fff;
			background-color: #ff5353;
		}
		.reset-attr-hover{
			background-color:#ff3a34;
		}
}

/* 点餐订单 */
.order-view{
	.radius();
	box-sizing: border-box;
	width: 96vw;
	margin: 0 2vw;
	position: absolute;
	z-index:200;
	bottom: 0;
	overflow: hidden;
	transition: all .5s;
	background-color:#484848;
}
.selectfoods-null{
	line-height: 58vh;
	text-align: center;
	color: #fff;
}
.order-id{
	.flex-btwn();
	justify-content: space-around;
	color: #fff;
	font-weight: 600;
	.order-id-text{
		font-size: 5vw;
	}
	.i-arrow{
		font-size: 7vw;
	}
}
.order-save{
	padding: 1vw;
	margin: 2vh 0;
	border-radius: 3px;
    color: #ffffff;
    font-size: 4vw;
    text-align: center;
	background-color: #00dcff;
}
.edit-order{
	.flex-btwn();
	justify-content: space-around;
	margin: 1vh 0;
	.edit-order-save{
		padding: 0.8vh 20vw;
		border-radius: 3px;
		color: #ffffff;
		font-size: 4vw;
		text-align: center;
		background-color: #09bbd8;
	}
	.edit-order-cancel{
		padding: 0.8vh 10vw;
		border-radius: 3px;
		color: #ffffff;
		font-size: 4vw;
		text-align: center;
		background-color: #66a3a9;
	}
}
/* .revoke{
		padding:1vh 0;
		color:#fff;
		font-size: 3vw;
		text-align: center;
		text-decoration:underline #fff;
} */
.order-time {
	padding: 1vh 1vw;
	font-size: 3vw;
	color: #fff;
}
/* 餐品卡片 */
.food-scrollview{
	height: 38vh;
	box-sizing: border-box;
}
.food-view{
	.radius();
	margin-top: 1vh;
	padding: 0.5vh 3vw;
	background-color:#fbfbfb;
	.food-head{
		.flex-btwn();
		.food-id{
			font-size: 3vw;
		}
		.food-btn{
			.flex-end();
		}
		.food-complete{
			.radius();
			.flex-btwn();
			font-size: 3vw;
			color: #fff;
			background-color: #00b2ce;
		}
		.food-del{
			.radius();
			.flex-btwn();
			margin-left: 1vw;
			font-size: 3vw;
			color: #fff;
			background-color: #c52b2b;
		}
		.i-close{
			font-size: 3vw;
		}
	}
	.food-msg{
		.flex-btwn();
		margin:1vh 0;
		padding-top: 1vh;
		border-top: 1px solid #00b2ce;
		.food-msg-base{
			.food-msg-base-name{
				font-size: 5vw;
				color:#00b2ce;
			}
			.food-msg-base-other{
				margin-left: 3vw;
				font-size: 3vw;
				color:#009bb3;
			}
		}
		.food-msg-price{
			font-size: 7vw;
			color:#009bb3;
		}
	}
	.food-note{
		padding-bottom: 1vh;
		margin-bottom: 1vh;
		border-bottom: 1px solid #00b2ce;
	}
	.food-state{
		.flex-btwn();
		.food-state-paymode{
			.flex-end();
			font-size: 3vw;
		}
		.food-state-complete{
			.flex-end();
			font-size: 3vw;
		}
	}
}
.food-view-over{
	opacity: 0.5;
}

.order-totalprice{
	font-size: 6vw;
	color: #fff;
	text-align: end;
	margin-top: 1vh;
	margin-right: 4vw;
}

</style>
