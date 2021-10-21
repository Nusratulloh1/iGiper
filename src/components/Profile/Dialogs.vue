<template>
    <el-container direction="vertical">                
        <div>
            <i class="el-icon-arrow-left"></i>
            <span @click="$emit('closeDialog')" class="text">{{$t('basic.back')}}</span>
        </div>
        
        <div style="display: flex; align-items: center; margin-top: 1rem">            
            <el-avatar :src="messagePiece.user.photo ? $serverImageUrl + messagePiece.user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"> </el-avatar>
            <span v-if="messagePiece.user.name" style="margin-left: 1rem">{{messagePiece.user.name}}</span>
            <span v-else-if="messagePiece.user.phone" style="margin-left: 1rem">{{messagePiece.user.phone}}</span>
        </div>
        
        <div id="messages">                            
            <div v-for="message in dialogs" :key="message.id">
                
                <el-row>
                    <el-col :span="24" v-if="message.toId != -1">
                        <!-- My Messages -->
                        <div class="my-messages">
                            <span>
                                {{message.text}}                                       
                            </span>
                            <span style="font-size: 12px; float: right; margin-top: 25px">{{message.date | toTime}}</span>
                        </div>
                    </el-col>

                    <el-col :span="24" v-else>
                        <!-- USER`S messags -->
                        <div class="user-messages" >                                    
                            <span style="float: left;">{{message.text}}</span>                                 
                            <span style="font-size: 12px; float: left; margin-top: 25px">{{message.date | toTime}}</span>
                        </div>
                    </el-col>
                </el-row>                        
            </div>                    
        </div>

        <div style="display: flex; margin-top: 7px;">
            <el-input @keypress.native.enter="send" style="margin-right: 7px;" v-model="message" :placeholder="$t('profile.message.your_message')"></el-input>
            <el-button @click="send" circle icon="el-icon-s-promotion"></el-button>                                
        </div>     
    </el-container>
</template>

<script>
export default {
    props: {
        messagePiece: {
            type: String | Object,
            required: true
        }
    },

    data () {
        return {
            dialogs: [],     
            
            message: '',

            messages: [],
            message: '',            
            showMessages: true,

            loading: true,

            dialogs: [],

            outputMessages: [],
            inputMessages: [],

            dialog: '',

            productName: '',
            userName: '',
            userId: 0,
            productImage: '',
            productId: ''
        }
    },

    mounted() {                
        this.seeMessage(this.messagePiece);
    },

    methods: {
        send () {            
            if (this.message === "") {                                
                return;
            }    

            const metadata = {
                url: 'message',
                method: 'post',
                data: {
                    fromId: -1,
                    text: this.message,
                    toId: this.userId,
                    productId: this.productId
                }
            }

            this.$store.dispatch('setData', metadata)
                .then(response => {
                    this.message = '';
                    this.seeMessage(this.dialog);
                })
                .catch(error => {
                    console.log(error);
                })
        },

        seeMessage (message) {     
            this.dialog = message;       
            
            const metadata = {
                url: 'messages',
                params: {
                    productId: message.product.id,
                    offset: 0,
                    size: 200
                },
                token: this.$store.state.userInfo.token                
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {                    
                    this.userName = message.user.name;
                    this.productName = message.product.name;
                    this.userId = message.user.id;
                    this.productId = message.product.id;

                    if (message.product.image) {
                        this.productImage = message.product.image;
                    }

                    this.dialogs = response.reverse();
                    
                    for (let index = 0; index < response.length; index++) {
                        const message = response[index];
                        
                        if (message.toId == -1) { // myMessages
                            this.outputMessages.push(message);
                        }else {
                            this.inputMessages.push(message);
                        }
                    }

                    this.showMessages = false;

                    
                    setTimeout(() => {
                        var objDiv = document.getElementById("messages");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500)
                })
                .catch(error => {

                })


        }
    }
}
</script>

<style lang="scss" scoped>

@import '../../custom.scss';

#messages {
    border: 1px $primary-color solid; 
    height: 230px; 
    margin-top: 12px; 
    overflow: auto; 
    padding: 7px 0;
}

.el-row {
    flex-wrap: wrap; 
    cursor: pointer;
}

.my-messages {
    margin-top: 7px;
    max-width: 46%;
    float: right; 
    padding: 10px;

    background: $primary-color;
    color: white; 
    border-radius: 12px;
    margin-right: 10px;
}

.my-messages::after {
    content: '';    
    border-top: 10px solid transparent;
    border-left: 20px solid $primary-color;
    border-bottom: 10px solid transparent;    

    position: absolute;
    right: 0;
    top: 20%;

}

.user-messages {
    margin-top: 7px;
    float: left; 
    padding: 10px;
    max-width: 46%; 
    background: #2c3e50; 
    color: white;  
    border-radius: 12px;
    margin-left: 10px;
}

.user-messages::before {
    content: '';
        
    border-top: 10px solid transparent;
    border-right: 20px solid #2c3e50;
    border-bottom: 10px solid transparent;
    position: absolute;
    
    left: 0px;
}

</style>
