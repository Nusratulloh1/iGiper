<template functional>    
    <div :style="'width: ' + props.width + 'px'" class="category" @click="listeners.insideItem('component')">        
        <div class="icons">
            <!-- <i class="main_icon" :class="props.icon"></i>   -->
            <img class="main_icon" width="90" height="90" src="@/assets/logo.png" alt="">  
            <div class="action_icon">
                <el-button circle size="mini" @click="listeners.editItem('salom')" class="action __edit" icon="el-icon-edit"></el-button>                            
                <el-button circle type="danger" @click="listeners.deleteItem('s')" size="mini" class="action __delete" icon="el-icon-delete"></el-button>
            </div>
        </div> 
        <span class="text text--truncate">{{props.text}}</span>        
    </div>
</template>

<script>
export default {
    props: {
        image: {
            type: String            
        },

        text: {
            type: String, 
            required: true
        },

        width: {
            type: String | Number,
            default: 186
        }
    }    
}
</script>

<style lang="scss" scoped>
    .category {                
        position: relative;
        width: 100%;
        height: 9.6rem;
        box-sizing: border-box;
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;            
        transition: box-shadow .3s;  
        cursor: pointer;      
        
        -webkit-box-shadow: 0px 0px 3px -1px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 3px -1px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 3px -1px rgba(0,0,0,0.75);

        &:hover {
            -webkit-box-shadow: 0px 0px 7px -1px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 0px 7px -1px rgba(0,0,0,0.75);
            box-shadow: 0px 0px 7px -1px rgba(0,0,0,0.75);
        }

        .icons {                    
            position: static;            
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;    
            margin-top: .7rem;                    

            .action_icon {                
                position: absolute; 
                top: 0; 
                right: 0; 
                margin: .5rem;        
                opacity: 0;                                
                transition: opacity .3s;                

                .action {
                    cursor: pointer;    
                }            

                __edit {

                }

                __delete {

                }
            }

            &:hover {
                .action_icon {
                    opacity: 1;
                }
            }


            .main_icon {
                font-size: 4.3rem;
            }
        }    

        .text {        
            padding: .5rem;             
            display: flex;
            justify-content: center;
            align-items: center;                                    
            font-size: 18px;
            width: 100%;     
            text-align: center;                                                       
        }

        .text--truncate {               
            line-clamp: 2;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
    }
</style>