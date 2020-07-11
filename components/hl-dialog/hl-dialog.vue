<template>
	<view class="hl-dialog default">
		<view class="dialog-mask"></view>
		<view class="dialog-cont">
			<view class="dialog-body">
				<view class="dialog-msg">
					这里是提示内容
				</view>
			</view>
			<view class="dialog-footer">
				<view class="dialog-btn success">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Object
		}
	}
</script>

<style>
</style>
