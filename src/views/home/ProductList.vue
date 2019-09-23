<template >
    <div class="ProductList">
        <div class="topSecrch">
            <div class="left-topSecrch">
                <Input v-model="params.phoneNumber" type="number" placeholder="手机号查询" style="width: 300px" />
                <div class="btn1">
                    <Button  @click="hangleSearch">查询</Button>
                </div>
            </div>
            <div class="btn">
                <Button @click="isShowAdd = true">新增商品</Button>
            </div>
        </div>
        <Table :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">{{isOnline}}</Button>
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
        >
            <Form class="top" :model="formData" name="formData">
                <FormItem label="productDes" name="productDes" label-position="top">
                    <Input v-model="formData.productDes" name="input1" placeholder="描述" />
                </FormItem>
                <FormItem label="schoolName" name="school" label-position="top">
                    <Input v-model="formData.schoolName" name="input2" placeholder="学校" />
                </FormItem>
                <FormItem label="schoolId" name="schoolId" label-position="top">
                    <Input v-model="formData.schoolId" name="input2" placeholder="学校id" />
                </FormItem>
                <FormItem label="userId" name="userId" label-position="top">
                    <Input v-model="formData.userId" name="input2" placeholder="用户id" />
                </FormItem>
                <FormItem label="studentNumber" name="studentNumber" label-position="top">
                        <Input v-model="formData.studentNumber" name="input3" placeholder="学号" />
                </FormItem>
                <FormItem label="status" name="status" label-position="top">
                        <Input v-model="formData.status" name="input3" placeholder="状态" />
                </FormItem>
                <FormItem label="phoneNumber" name="phoneNumber" label-position="top">
                        <Input v-model="formData.phoneNumber" name="input4" placeholder="手机号" />
                </FormItem>
                <Upload 
                    action="/api/image/upload"
                    :on-success="handleSuccess">
                    <Button icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
            </Form>
            <div v-for="(item,index) in imageList" :key="index">
                <img class="smallPic" :src="item" alt="">
            </div>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="isShowAdd = false">Cancel</Button>
                <Button type="primary" @click="submitAdd">Submit</Button>
            </div>
        </Drawer> 
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    name: 'ProductList',
    data () {
        return {
            model: false,
            isOnline: '',
            isShowAdd: false,
            columns: [
                {
                    title: '杂货ID',
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
                    title: '学校ID',
                    key: 'schoolId'
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
                        this.isOnline = params.row.status? '下线': '上线';
                        return h('div', params.row.status? '上线中': '待审核')
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            data: [],
            imageList: [],
            params: {
                pageSize: 2,
                pageNum: 1,
                phoneNumber: ''
            },
            total: 0,
            formData: {
                status: 0
            }
        }
    },
    computed: {
        ...mapState({
            checkoutStatus: state => state.cart.checkoutStatus
        })
    },
    methods: {
        getCommodityList(params) {
            this.httpService.getCommodityList(params).then(res => {
                if (res.code) {
                    this.data = res.data.data
                    this.total = res.data.total
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        handleSuccess(res) {
            if (res.code === 0) {
                this.imageList.push(res.data.img);
            } else {
                console.log(res.msg)
            }
        },
        submitAdd() {
            this.formData.imageUrl = JSON.stringify(this.imageList)
            this.httpService.handleAddcommodity (this.formData).then(res => {
                if (res.code) {
                    this.getCommodityList(this.params)
                    this.isShowAdd = false
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            })
        },
        pageChange(e) {
            this.params.pageNum = e;
            this.getCommodityList(this.params)
        },
        hangleSearch() {
            this.getCommodityList(this.params)
        },
        show(row) {
            this.httpService.handleEditStatus({
                commdityId: row._id,
                status: row.status === 0?1:0
            }).then(res => {
                if (res.code) {
                    this.getCommodityList()
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            })
        }
    },
    mounted() {
        this.getCommodityList(this.params)
    }
};
</script>
<style lang="less" scoped>
.topSecrch{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.left-topSecrch{
    display: flex;
}
.btn1{
    margin-bottom:10px;
    margin-left:10px;
}
.btn{
    width: 100%;
    display: flex;
    flex-flow: row-reverse;
    margin-bottom:10px;
}
.smallPic{
    width: 100px;
}
.page{
    float: right;
    margin-top: 30px;
}
.top{
    margin-top: 40px;
}
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: -200px;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
