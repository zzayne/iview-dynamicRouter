<template>
    <div>
        <h1>page2</h1>
        <Button v-hasPermission="'add'">添加</Button>
        <Button v-hasPermission="'edit'">修改</Button>
        <Button v-hasPermission="'del'">删除</Button>
    </div>
</template>

<script>
export default {
    name: 'page2'
};
</script>