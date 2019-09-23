<template>
    <div class="Users">
        <div class="left-topSecrch">
            <Input v-model="params.phoneNumber" type="number" placeholder="手机号查询" style="width: 300px" />
            <div class="btn1">
                <Button  @click="hangleSearch">查询</Button>
            </div>
        </div>
        <Table :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="action">
                <div class="btn-class">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="conllonDetail(row)">杂货详情</Button>
                    <Button type="primary" size="small" style="margin-right: 5px" @click="showConllon(row)">收藏详情</Button>
                </div>
            </template>
        </Table>
        <div class="page">
            <Page @on-change="pageChange" :total="total" :current="params.pageNum" :page-size="params.pageSize"/>
        </div>
        <Drawer
            title="add"
            v-model="isShowAdd"
            width="720"
            name="Drawer"
            :styles="styles"
        >
            <Form :model="formData" name="formData">
                <FormItem label="Name" name="Name" label-position="top">
                    <Input v-model="formData.name" name="input1" placeholder="姓名" />
                </FormItem>
                <FormItem label="openId" name="openId" label-position="top">
                    <Input v-model="formData.openId" placeholder="openId" />
                </FormItem>
                <FormItem label="school" name="school" label-position="top">
                    <Input v-model="formData.school" name="input2" placeholder="学校" />
                </FormItem>
                <FormItem label="studentNumber" name="studentNumber" label-position="top">
                        <Input v-model="formData.studentNumber" name="input3" placeholder="学号" />
                </FormItem>
                <FormItem label="phoneNumber" name="phoneNumber" label-position="top">
                        <Input v-model="formData.phoneNumber" name="input4" placeholder="手机号" />
                </FormItem>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="isShowAdd = false">Cancel</Button>
                <Button type="primary" @click="submitAdd">Submit</Button>
            </div>
        </Drawer> 
        <Drawer
            title="add"
            v-model="isShowConllon"
            width="90%"
            name="Drawer"
            :styles="styles"
        >
            <Table  :columns="columns1" :data="collectionList"></Table>
        </Drawer> 
        <Drawer
            title="add"
            v-model="isShowDetail"
            width="90%"
            name="Drawer"
            :styles="styles"
        >
            <Table  :columns="columns2" :data="sellList"></Table>
        </Drawer> 
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    name: 'Users',
    data () {
        return {
            isShowAdd: false,
            isShowConllon: false,
            isShowDetail: false,
            columns: [
                {
                    title: '用户ID',
                    key: '_id'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '学校',
                    key: 'school'
                },
                {
                    title: '学生证号码',
                    key: 'studentNumber'
                },
                {
                    title: '手机号码',
                    key: 'phoneNumber'
                },
                {
                    title: '创建时间',
                    key: 'creatTime',
                    render: (h,params)=>{
                        console.log(params.row.creatTime)
                        return h('div',
                            this.$dateFormat(params.row.creatTime , 'yyyy-MM-dd hh:mm:ss')
                        )
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            columns1: [
                {
                    title: '收藏ID',
                    key: '_id'
                },
                {
                    title: '描述',
                    key: 'productDes'
                },
                {
                    title: '图片',
                    key: 'imageUrl',
                    width: '240px',
                    render: (h, params) => {
                        let gpu = []
                        if (params.row.imageUrl[0]) {
                            JSON.parse(params.row.imageUrl).forEach(element => {
                                gpu.push(h('img', {
                                    attrs: {
                                        'src': element
                                    },
                                    style: {
                                        width: '60px',
                                        borderRadius: '3px',
                                        marginRight: '5px'
                                    },
                                }))
                            });
                        }
                        return h('div', gpu)
                    }
                },
                {
                    title: '手机号码',
                    key: 'phoneNumber'
                },
                {
                    title: '学校名',
                    key: 'schoolName'
                },
                {
                    title: '创建时间',
                    key: 'creatTime',
                    width: '180px',
                    render: (h,params)=>{
                        return h('div',
                            this.$dateFormat(params.row.creatTime, 'yyyy-MM-dd hh:mm:ss')
                        )
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        return h('div', params.row.status? '已收藏': '已取消')
                    }
                },
            ],
            columns2: [
                {
                    title: '收藏ID',
                    key: '_id'
                },
                {
                    title: '描述',
                    key: 'productDes'
                },
                {
                    title: '图片',
                    key: 'imageUrl',
                    width: '240px',
                    render: (h, params) => {
                        let gpu = []
                        if (params.row.imageUrl[0]) {
                            JSON.parse(params.row.imageUrl).forEach(element => {
                                gpu.push(h('img', {
                                    attrs: {
                                        'src': element
                                    },
                                    style: {
                                        width: '60px',
                                        borderRadius: '3px',
                                        marginRight: '5px'
                                    },
                                }))
                            });
                        }
                        return h('div', gpu)
                    }
                },
                {
                    title: '手机号码',
                    key: 'phoneNumber'
                },
                {
                    title: '学校名',
                    key: 'schoolName'
                },
                {
                    title: '创建时间',
                    key: 'creatTime',
                    width: '180px',
                    render: (h,params)=>{
                        return h('div',
                            this.$dateFormat(params.row.creatTime, 'yyyy-MM-dd hh:mm:ss')
                        )
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        return h('div', params.row.status? '已收藏': '已取消')
                    }
                },
            ],
            sellList: [],
            collectionList: [],
            params: {
                pageSize: 2,
                pageNum: 1,
                phoneNumber: ''
            },
            total: 0,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            formData: {
                name: '',
                school: '',
                studentNumber: '',
                phoneNumber: '',
                openId: ''
            },
            data: []
        }
    },
    computed: {
        ...mapState({
            checkoutStatus: state => state.cart.checkoutStatus
        })
    },
    methods: {
        getUserList(params) {
            this.httpService.getUserList(params).then(res => {
                if (res.code) {
                    this.data = res.data.data
                    this.total = res.data.total
                }
            });
        },
        pageChange(e) {
            this.params.pageNum = e;
            this.getUserList(this.params)
        },
        showConllon(item) {
            this.isShowConllon = true
            this.httpService.getCollectionList({userId: item._id}).then(res => {
                if (res.code) {
                    this.collectionList = res.data
                }
            })
        },
        conllonDetail(item) {
            console.log(item)
            this.isShowDetail = true
            this.httpService.getUserCmmList({userId: item._id}).then(res => {
                if (res.code) {
                    this.sellList = res.data
                }
            })
        },
        hangleSearch() {
            this.getUserList(this.params)
        },
        submitAdd() {
            for (const key in this.formData) {
                if (this.formData[key] === undefined || this.formData[key] === "") {
                    this.$Message.error(res.msg);
                    return;
                }
            }
            this.httpService.addUser(this.formData).then(res => {
                if (res.code) {
                    this.isShowAdd = false
                    this.$Message.success(res.msg);
                } else {
                    this.isShowAdd = false
                    this.$Message.error(res.msg);
                }
            });
        }
    },
    mounted() {
        this.getUserList(this.params)
    }
};
</script>
<style lang="less" scoped>
.btn{
    width: 100%;
    display: flex;
    flex-flow: row-reverse;
}
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
.page{
    float: right;
    margin-top: 30px;
}
.left-topSecrch{
    display: flex;
}
.btn1{
    margin-bottom:10px;
    margin-left:10px;
}
.btn-class{
    display: flex;
}
</style>
