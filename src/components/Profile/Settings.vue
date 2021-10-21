<template>
  <el-container direction="vertical" class="m-2">
    <el-row>
      <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">
        {{$t('basic.back')}}</el-button>
    </el-row>
    <el-row type="flex" justify="space-between" style="flex-wrap: wrap;"
      :style="'font-size: ' + $store.state.isMobileVersion ? '.5rem' : '1rem'">
      <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
        <div class="my-2">
          <span>{{$t('basic.language')}}: </span>
          <el-link style="font-size: 1.2rem; font-weight: 500;" @click="changeLang(1)"
            :class="mainLang == 1 ? 'active-lang' : 'default'">
            <span style="display: flex; flex-direction: column">
              <img src="@/assets/uz.png" height="30px" alt="uz">
              <span style="margin-top: 2px; font-size: 14px;">UZB</span>
            </span>
          </el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link style="font-size: 1.2rem; font-weight: 500;" @click="changeLang(2)"
            :class="mainLang == 2 ? 'active-lang' : 'default'">
            <span style="display: flex; flex-direction: column">
              <img src="@/assets/ru.png" height="30px" alt="ru">
              <span style="margin-top: 2px; font-size: 14px;">RUS</span>
            </span>
          </el-link>
        </div>
        <span>{{$t('basic.personal_info')}}</span>
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <el-form ref="userInfoForm" v-loading="userInfoFormData.loading" label-position="top"
              :model="userInfoFormData" :rules="userInfoFormData.rules">
              <el-form-item>
                <div style="width: 67%; position: relative; left: 50%; transform: translateX(-50%)"
                  v-loading="userInfoFormData.image.loading">
                  <div id="image-box" @click="selectImageFile">
                    <img v-if="userInfoFormData.image.url" width="100%" height="120"
                      style="border-radius: 4px; object-fit: cover; object-position: center;"
                      :src="$serverImageUrl + userInfoFormData.image.url" alt="">

                    <div v-if="userInfoFormData.image.url">
                      <i @click="seeImage(userInfoFormData.image.url)" class=el-icon-rank></i>
                      <i @click="deleteImage(0)" class="el-icon-delete"></i>
                    </div>

                    <i v-else class="fas fa-camera no-image-yet"></i>

                    <input type="file" ref="imageFile" @change="onFileSelected" hidden>
                  </div>
                </div>
              </el-form-item>

              <el-form-item :label="$t('advertise.user_name')" prop="username">
                <el-input placeholder="username" v-model="userInfoFormData.username"></el-input>
              </el-form-item>

              <el-form-item prop="dummyRegion" :label="$t('advertise.region')">
                <el-input style="display: none;" v-model="userInfoFormData.dummyRegion"></el-input>
                <el-cascader class="hidden-sm-and-down" :placeholder="$t('advertise.region')"
                  v-model="userInfoFormData.regionId" style="width: 100%" :options="allRegions"
                  :props="{ checkStrictly: true }" clearable>
                </el-cascader>

                <treeselect class="hidden-md-and-up" :options="allRegions" :multiple="false"
                  :placeholder="$t('advertise.region')" v-model="userInfoFormData.phoneRegionId" />

                <!-- <treeselect class="hidden-md-and-up"
                    v-else
                    :options="rootRegions"
                    :multiple="false"
                    :load-options="loadRegionsOptions"
                    :placeholder="$t('advertise.region')"
                    v-model="userInfoFormData.phoneRegionId" /> -->
              </el-form-item>

              <el-form-item>
                <el-button @click="changeUserInfo" type="primary" style="float: right">{{$t('basic.save')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="$serverImageUrl + userInfoFormData.dialogImageUrl" alt="">
        </el-dialog>
      </el-col>

      <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
        <span>{{$t("basic.change_password")}}</span>
        <el-form ref="changePasswordForm" v-loading="changePasswordFormData.loading" :model="changePasswordFormData"
          :rules="changePasswordFormData.rules">
          <el-form-item :label="$t('basic.current_password')" prop="oldPassword">
            <el-input type="password" show-password :placeholder="$t('basic.current_password')"
              v-model="changePasswordFormData.oldPassword"></el-input>
          </el-form-item>

          <el-form-item :label="$t('basic.password')" prop="newPassword">
            <el-input type="password" show-password :placeholder="$t('basic.password')"
              v-model="changePasswordFormData.newPassword"></el-input>
          </el-form-item>

          <el-form-item :label="$t('basic.confirm_new_password')" prop="confirmPassword">
            <el-input type="password" show-password :placeholder="$t('basic.confirm_new_password')"
              @keypress.native.enter="changePassword" v-model="changePasswordFormData.confirmPassword"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="changePassword">{{$t('basic.change')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-button @click="logout" style="margin-top: 1rem" type="warning" size="mini">{{$t('basic.logout')}}</el-button>
  </el-container>
</template>

<script>
  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import {
    LOAD_CHILDREN_OPTIONS
  } from '@riophae/vue-treeselect'


  import 'element-ui/lib/theme-chalk/display.css'

  import Cookies from 'js-cookie'

  export default {
    components: {
      Treeselect
    },

    data() {
      let checkPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('rules.password')))
        } else if (value.length < 6) {
          callback(new Error(this.$t('rules.number6')))
        } else {
          callback();
        }
      };

      let checkConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('rules.confirm_password')))
        } else if (value !== this.changePasswordFormData.newPassword) {
          callback(new Error(this.$t('rules.password_must_match')))
        } else {
          callback();
        }
      };

      return {
        mainLang: 1,
        regionProps: {
          lazy: true,
          checkStrictly: true,

          lazyLoad: (node, resolve) => {

            let value = node.value ? node.value : 0;

            const metadata = {
              url: 'regions',

              params: {
                pId: value,
                lang: this.$store.state.mainLang
              }
            }

            this.$store.dispatch('getData', metadata)
              .then(response => {

                let nodes = [];

                if (value) {
                  nodes = response.map(node => ({
                    value: node.id,
                    label: node.name
                  }))
                } else {
                  nodes = response.filter(node => {
                    return node.parentId === null;
                  }).map(node => ({
                    value: node.id,
                    label: node.name
                  }))
                }

                // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
                resolve(nodes);
              })
          }
        },

        updateComponent: 0,

        activeName: '0',

        rootRegions: [],
        allRegions: [],
        notNestedRegions: [],

        dialogVisible: false,

        userInfoFormData: {
          loading: false,
          image: {
            loading: false,
            url: this.$store.state.userInfo.imageUrl,
            object: null,
            dialogImageUrl: '',
            dialogVisible: false
          },

          password: '',

          dummyRegion: '',
          regionId: undefined,
          phoneRegionId: undefined,

          username: this.$store.state.userInfo.name,

          rules: {
            username: [
              //{ required: true, message: 'username ni kiritish shart', trigger: 'blur' }
            ],

            password: [{
              required: true,
              message: this.$t('basic.password_for_change'),
              trigger: 'blur'
            }]
          }
        },

        changePasswordFormData: {
          loading: false,

          oldPassword: '',
          newPassword: '',
          confirmPassword: '',

          rules: {
            oldPassword: [{
              required: true,
              validator: checkPassword,
              trigger: 'blur'
            }, ],
            newPassword: [{
              required: true,
              validator: checkPassword,
              trigger: 'blur'
            }, ],
            confirmPassword: [{
              required: true,
              validator: checkConfirmPassword,
              trigger: 'blur'
            }, ]
          }
        }
      }
    },
    created() {
      let mainLang = Cookies.get('lang');

      if (mainLang === 'ru' || !mainLang) {
        mainLang = 'ru';
        this.mainLang = 2;
      } else {
        mainLang = 'uz';
        this.mainLang = 1;
      }

      this.$store.commit('SET_MAIN_LANG', mainLang);
      Cookies.set('lang', mainLang);
    },

    mounted() {
      this.getRegions();

      setTimeout(() => {
        if (this.$store.state.isMobileVersion) {
          this.userInfoFormData.phoneRegionId = [...(this.$store.state.userInfo.regionId.split(','))].pop();
          if (this.userInfoFormData.phoneRegionId) {
            this.userInfoFormData.dummyRegion = 'dummy';
          }
        } else {
          this.userInfoFormData.regionId = this.$store.state.userInfo.regionId.split(',').map(data => parseInt(
            data));
          if (this.userInfoFormData.regionId.length > 0) {
            this.userInfoFormData.dummyRegion = 'dummy';
          }
        }
      }, 2000);
    },

    methods: {
      logout() {
        Cookies.remove('userInfo');
        this.$store.commit('CLEAR_USER_INFO');
        this.$notify({
          type: 'success',
          title: this.$t('basic.success'),
          message: this.$t('basic.loged_out'),
          duration: 3000
        })

        this.$router.push({
          path: '/'
        });
      },
      changeLang(lang) {
        this.mainLang = lang;
        const mainLang = lang == 1 ? 'uz' : 'ru';

        this.$store.commit('SET_MAIN_LANG', mainLang);
        Cookies.set('lang', mainLang);
        document.location.reload();
      },
      getData() {
        const payload = this.$store.state.userInfo;

        this.userInfoFormData.username = payload.name;
      },

      getCategories() {

        const metadata = {
          url: 'categories',
          params: {
            lang: this.$store.state.mainLang
          }
        }

        this.$store.dispatch('getData', metadata)
          .then(response => {
            // those that don`t have parentId are root categories 

            this.notNesteCategories = response;

            this.categories = response.filter(category => {
              return category.parentId === null;
            }).map(category => {
              return {
                id: category.id,
                label: category.name,
                parentId: category.parentId,
                children: null
              }
            });
            response = response.map(data => {
              return {
                id: data.id,
                value: data.id,
                label: data.name,
                parentId: data.parentId
              }
            });

            this.allCategories = this.getNestedChildren(response, null);
          })
      },

      selectImageFile() {
        // if image is already selected the user cannot override it. 
        // In order to override an image one needs to delete previous image
        // and select the new one 
        if (!this.userInfoFormData.image.url) {
          this.$refs['imageFile'].click();
        }
      },

      loadRegionsOptions({
        action,
        parentNode,
        callback
      }) {
        // Typically, do the AJAX stuff here.
        // Once the server has responded,
        // assign children options to the parent node & call the callback.                   
        if (action === LOAD_CHILDREN_OPTIONS) {
          //check if this is a new array in other words a new root region
          for (let index = 0; index < this.categories.length; index++) {
            const element = this.categories[index];

            if (element.id == parentNode.id) {
              this.selectedRegions = [];
              break;
            }
          }

          const metadata = {
            url: 'regions',
            params: {
              pId: parentNode.id,
              lang: this.$store.state.mainLang
            }
          }

          this.$store.dispatch('getData', metadata)
            .then(response => {
              const subCategories = response;

              let nodes = subCategories.map(subCategory => ({
                parentId: subCategory.parentId,
                id: subCategory.id,
                label: subCategory.name,
                children: null
              }));

              parentNode.children = nodes;

              callback();
            })
            .catch(exception => {
              callback(exception);
            })

        }
      },

      seeImage(imageUrl) {
        this.userInfoFormData.dialogImageUrl = imageUrl;
        this.dialogVisible = true;
      },

      onFileSelected(event) {
        this.userInfoFormData.image.loading = true;
        this.userInfoFormData.image.object = event.target.files[0];

        const fileReader = new FileReader();

        fileReader.addEventListener('load', () => {
          //this.images[this.activeImageIndex].url = fileReader.result;                
          this.uploadImage(this.userInfoFormData.image.object)
            .then(response => {
              this.userInfoFormData.image.url = response;
              this.userInfoFormData.image.loading = false;
            })
        });

        fileReader.readAsDataURL(this.userInfoFormData.image.object);

        document.getElementById('image-box').style.cursor = 'default';
      },

      uploadImage(imageObj) {
        return new Promise((resolve, reject) => {
          let myData = new FormData();

          myData.append('image', imageObj);

          const metadata = {
            url: 'upload/image',
            params: {
              dir: 'users'
            },
            method: 'post',
            data: myData
          }

          this.$store.dispatch('setData', metadata)
            .then(response => {
              resolve(response);
            })
            .catch(e => {
              reject();
            })
        })
      },

      deleteImage(index) {
        let image = document.getElementById('image-box').getElementsByTagName('img')[0];

        image.style.transition = '1s';
        image.style.transform = 'translateY(-101%)';

        setTimeout(() => {
          this.userInfoFormData.image.url = '';
          this.userInfoFormData.image.object = null;
        }, 1000);
      },

      changeUserInfo() {
        this.$refs.userInfoForm.validate(valid => {
          if (valid) {

            let regionId = [];

            if (this.$store.state.isMobileVersion) {

              if (this.userInfoFormData.phoneRegionId) {

                let temp = this.notNestedRegions.find((data) => {
                  return data.id == this.userInfoFormData.phoneRegionId;
                });

                let temp2 = 0;
                do {
                  temp2++;
                  for (let index = 0; index < this.notNestedRegions.length; index++) {
                    const element = this.notNestedRegions[index];

                    if (element.id == temp.parentId) {
                      regionId.push(temp.id);
                      temp = element;
                      break;
                    }
                  }
                } while (temp.parentId == 0 || temp.parentId);

                regionId.push(temp.id);

                regionId = regionId.reverse();

                regionId = regionId.join(',');
              }

            } else {
              regionId = this.userInfoFormData.regionId ? this.userInfoFormData.regionId.join(',') : null;
            }


            this.userInfoFormData.loading = true;

            const metadata = {
              url: 'user',
              data: {
                photo: this.userInfoFormData.image.url,
                name: this.userInfoFormData.username,
                regionId
              },
              method: 'put'
            }

            this.$store.dispatch('setData', metadata)
              .then(response => {
                if (!response) {
                  this.$notify({
                    type: 'error',
                    message: this.$t('basic.wrong_password'),
                    duration: 4000
                  })
                } else {
                  this.$notify({
                    type: 'success',
                    message: this.$t('basic.info_changed'),
                    duration: 4000
                  })
                  this.activeName = '0';

                  let payload = Cookies.getJSON('userInfo');

                  payload.name = this.userInfoFormData.username;
                  payload.imageUrl = this.userInfoFormData.image.url;
                  payload.regionId = regionId;

                  this.$store.commit('SET_USER_INFO', payload);

                  Cookies.set('userInfo', payload);
                  this.clearUserInfo();

                  this.$emit('update');
                }
              })
              .catch(error => {
                this.$notify({
                  type: 'error',
                  message: this.$t('basic.server_error'),
                  duration: 4000
                })
              })
              .finally(() => {
                //this.$refs.userInfoForm.resetFields();              
                document.body.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                this.userInfoFormData.loading = false;
              })

          }
        })
      },

      changePassword() {
        this.$refs.changePasswordForm.validate(valid => {
          if (valid) {
            this.changePasswordFormData.loading = true;
            const metadata = {
              url: 'user',
              data: {
                password: this.changePasswordFormData.oldPassword,
                newPassword: this.changePasswordFormData.newPassword
              },
              method: 'put'
            }

            this.$store.dispatch('setData', metadata)
              .then(response => {
                if (!response) {
                  this.$notify({
                    type: 'error',
                    message: this.$t('basic.wrong_password'),
                    duration: 4000
                  })

                } else {
                  this.$notify({
                    type: 'success',
                    message: this.$t('basic.password_changed'),
                    duration: 4000
                  })
                  this.activeName = '0';
                }
              })
              .catch(error => {
                this.$notify({
                  type: 'error',
                  message: this.$t('basic.server_error'),
                  duration: 4000
                })
              })
              .finally(() => {
                this.$refs.changePasswordForm.resetFields();
                this.clearChangePasswordFormData();
                document.body.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                this.changePasswordFormData.loading = false;
              })

          }
        })
      },

      clearUserInfo() {
        this.userInfoFormData.image.url = '';
        this.userInfoFormData.image.loading = false;
        this.userInfoFormData.image.object = null;

        this.userInfoFormData.username = '';
        this.userInfoFormData.password = '';
      },

      clearChangePasswordFormData() {
        this.changePasswordFormData.oldPassword = '';
        this.changePasswordFormData.newPassword = '';
        this.changePasswordFormData.confirmPassword = '';
        this.changePasswordFormData.loading = false;
      },

      getNestedChildren(arr, parent) {
        let out = [];
        for (let i in arr) {
          if (arr[i].parentId == parent) {
            let children = this.getNestedChildren(arr, arr[i].value);

            if (children.length) {
              arr[i].children = children;
            }
            out.push(arr[i]);
          }
        }
        return out
      },

      getRegions() {
        const metadata = {
          url: 'regions',
          params: {
            lang: this.$store.state.mainLang
          }
        }

        this.$store.dispatch('getData', metadata)
          .then(response => {
            this.notNestedRegions = response;

            this.rootRegions = response.filter(region => {
              return region.parentId === null; // those whose parentIds are null are root regions
            })

            this.rootRegions = this.rootRegions.map(region => {
              return {
                label: region.name,
                id: region.id,
                parentId: region.parentId,
                children: null
              }
            })

            response = response.map(data => {
              return {
                id: data.id,
                value: data.id,
                label: data.name,
                parentId: data.parentId
              }
            });

            this.allRegions = this.getNestedChildren(response, null);
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../custom.scss';

  .active-lang {
    color: $primary-color;
  }

  .el-card {
    cursor: pointer;

    .text {
      display: flex;
      flex-direction: column;
      padding: 10px;
    }
  }

  .image-size-note {
    background: $primary-color;
    padding: 25px;
    border-radius: 5px;
  }

  #image-box {
    cursor: pointer;
    position: relative;
    height: 120px;
    border: #495057 solid 1px;
    border-radius: 3.5px;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    img {
      filter: none;
      transition: filter .5s;
    }


    div {
      top: 100%;
      position: absolute;
      transition: transform .5s;

      width: 100%;
      display: flex;
      justify-content: center;

      padding: 3px;

      i {
        cursor: pointer;
        border-radius: 50%;
        background: black;
        color: #ECECEC;
        padding: 7px;
        margin: 0 4px;
        height: 100%;
        transition: .3s;
        position: relative;
      }

      i:hover {
        border-radius: 70%;
        border-color: white;
        border-width: 1px;
        border-style: solid;
      }
    }

    i.no-image-yet {
      font-size: 3rem;
    }

    //HOVER 
    &:hover i.no-image-yet {
      color: $primary-color;
    }

    &:hover div {
      transform: translateY(-100%);
    }

    &:hover img {
      filter: blur(2px);
    }
  }
</style>