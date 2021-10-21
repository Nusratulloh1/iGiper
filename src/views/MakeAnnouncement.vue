<template>
  <el-container direction="vertical" v-loading="loading">
    <el-row type="flex" justify="center" style="flex-wrap: wrap;">
      <div style="width: 100%">
        <el-row class="hidden-md-and-up mt-3 mx-4" style="display: flex; align-items: center;">
          <el-col :span="10">
            <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">
              {{ $t('basic.back') }}
            </el-button>
          </el-col>
          <el-col :span="14">
            <h5 class="mb-0" style="text-align: left;">{{ $t('advertise.title') }}</h5>
          </el-col>
        </el-row>
        <el-divider class="mt-1"></el-divider>
      </div>
      <el-col class="hidden-sm-and-down" :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
        <h3 class="mb-0" style="text-align: center;">{{ $t('advertise.title') }}</h3>
        <el-divider></el-divider>
      </el-col>
      <el-col :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
  <div id="my-strictly-unique-vue-upload-multiple-image" style="display: flex; justify-content: center; margin-top: 60px">
    <vue-upload-multiple-image
      :maxImage="10"
      markIsPrimaryText="Установить по умолчанию"
      popupText="Это изображение будет отображаться по умолчанию"
      dragText="+"
      primaryText="По умолчанию"
      browseText="Выберите"
      dropText="Бросьте свои файлы сюда..."
      @upload-success="uploadImageSuccess"
      @before-remove="beforeRemove"
      @edit-image="editImage"
      :data-images="images1"
      idUpload="myIdUpload"
      editUpload="myIdEdit"
      ></vue-upload-multiple-image>
  </div>
        <el-form ref="adInfo" label-position="top" :model="formData" :rules="rules">
          <el-form-item prop="title" :label="$t('advertise.product_name')">
            <el-input v-model="formData.title" :placeholder="$t('advertise.product_name')"></el-input>
          </el-form-item>

          <el-form-item prop="dummyCategory" :label="$t('advertise.category')">
            <el-input style="display: none;" v-model="formData.dummyCategory"></el-input> <!-- for validating -->

            <el-cascader v-if="adId"
                         disabled
                         :placeholder="$t('advertise.category')"
                         class="hidden-sm-and-down"
                         v-model="formData.categoryId"
                         style="width: 100%"
                         :options="allCategories"
                         @change="onCategorySelected"
                         :props="{ checkStrictly: true }"
                         clearable></el-cascader>

            <el-cascader v-else
                         :placeholder="$t('advertise.category')"
                         class="hidden-sm-and-down"
                         v-model="formData.categoryId"
                         style="width: 100%"
                         :props="categoryProps"
                         @change="onCategorySelected"
                         clearable></el-cascader>

            <treeselect class="hidden-md-and-up"
                        v-if="adId"
                        disabled
                        :options="allCategories"
                        :clearable="false"
                        :multiple="false"
                        :placeholder="$t('advertise.category')"
                        v-model="formData.phoneCategoryId"
            />

            <treeselect class="hidden-md-and-up"
                        v-else
                        :clearable="false"
                        @select="onCategorySelected"
                        :options="allCategories"
                        :multiple="false"
                        :placeholder="$t('advertise.category')"
                        v-model="formData.phoneCategoryId"
            />
          </el-form-item>

          <!-- <el-select v-model="type.selected" placeholder="Select" style="margin-bottom: 1em">
              <el-option v-for="item of type.items" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
          </el-select> -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form ref="contactInfo" label-position="top" :model="formData" :rules="rules">
              <el-form-item prop="dummyRegion" :label="$t('advertise.region')">
                <el-input style="display: none;" v-model="formData.dummyRegion"></el-input>
                <el-cascader
                    v-if="adId"
                    class="hidden-sm-and-down"
                    :placeholder="$t('advertise.region')"
                    v-model="formData.regionId"
                    style="width: 100%"
                    :options="allRegions"
                    :props="{ checkStrictly: true }"
                    clearable></el-cascader>

                <el-cascader
                    v-else
                    class="hidden-sm-and-down"
                    v-model="formData.regionId"
                    :placeholder="$t('advertise.region')"
                    style="width: 100%"
                    :props="regionProps"
                    clearable></el-cascader>

                <treeselect class="hidden-md-and-up"
                            v-if="adId"
                            :options="allRegions"
                            :multiple="false"
                            :placeholder="$t('advertise.region')"
                            v-model="formData.phoneRegionId"/>

                <treeselect class="hidden-md-and-up"
                            v-else
                            :options="allRegions"
                            :multiple="false"
                            :placeholder="$t('advertise.region')"
                            v-model="formData.phoneRegionId"/>
              </el-form-item>
            </el-form>
          </el-col>

          <div>
            <strong> {{ $t('advertise.type_of_payment') }} </strong> <br>

            <div style="margin-top: 1em; display: flex">
              <el-radio style="margin: 0px; font-size: 12px" v-model="type.selected" :label="1" border>{{ $t('advertise.ordinary') }}</el-radio>
              <el-radio v-show="selectedCategoryForInstallment && selectedCategoryForInstallment.isInstallment == 1"
                        v-model="type.selected" style="font-size: 12px" :label="2" border>{{ $t('advertise.installment') }}
              </el-radio>
            </div>

            <div>
              <el-row type="flex" style="flex-wrap: wrap;" :gutter="20">
                <el-col :xl="type.selected == 1 ? 24 : 12" :lg="type.selected == 1 ? 24 : 12" :sm="18">
                  <el-form-item v-if="!isFreeOrExchange" prop="dummyPrice" :label="$t('advertise.price')">
                    <el-input id="price" v-model="formData.dummyPrice" :placeholder="$t('advertise.price')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-show="type.selected == 2" :xl="20" :lg="20" :sm="20">
                  <el-form-item
                      :prop="(type.selected == 2 && selectedCategoryForInstallment.isInstallment == 1) ? 'prepay' : ''"
                      :label="$t('advertise.prepay')">
                    <el-input id="prepay" v-model="formData.prepay" :placeholder="$t('advertise.prepay')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="4" :lg="4" :sm="4">
                  <el-form-item v-if="!isFreeOrExchange" prop="currencyId">
                    <el-input style="display: none;" v-model="formData.currencyId"></el-input> <!-- for validating -->
                    <el-select clearable style="width: 100%;" v-model="formData.currencyId"
                               :placeholder="$t('advertise.currency')">
                      <el-option
                          v-for="item in currencies"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-show="type.selected == 2" :gutter="20" type="flex" style="flex-wrap: wrap">
                <el-col :xl="12" :lg="12" :sm="24">
                  <el-form-item
                      :prop="(type.selected == 2 && selectedCategoryForInstallment.isInstallment == 1) ? 'month' : ''"
                      :label="$t('advertise.month')">
                    <el-input id="month" v-model="formData.month" :placeholder="$t('advertise.month')"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :xl="12" :lg="12" :sm="24">
                  <el-form-item
                      :prop="(type.selected == 2 && selectedCategoryForInstallment.isInstallment == 1) ? 'monthly_payment' : ''"
                      :label="$t('advertise.monthly_payment')">
                    <el-input id="monthly_payment" v-model="formData.monthly_payment"
                              :placeholder="$t('advertise.monthly_payment')"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>


          <el-row v-if="formData.attributes.nums.length > 0" :gutter="15" type="flex" style="flex-wrap: wrap;">
            <el-col :xl="12" :lg="12" :sm="24" :xs="24" v-for="(num, index) in formData.attributes.nums" :key="num.id">
              <el-form-item :label="num.name" prop="num">
                <el-input @change="activeNumIndex = index" :id="`num_${index}`"
                          :placeholder="`[${num.min}, ${num.max}] (min, max)`"
                          v-model="formData.nums[index].dummy"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- strs -->
          <el-row v-if="formData.attributes.strs.length > 0" :gutter="15" type="flex" style="flex-wrap: wrap;">
            <el-col :xl="12" :lg="12" :sm="24" :xs="24" v-for="(str, index) in formData.attributes.strs" :key="str.id">
              <el-form-item :label="str.name" prop="str">
                <el-input @change="activeStrIndex = index" :id="`str_${index}`" :placeholder="str.name"
                          v-model="formData.strs[index].dummy"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- customs -->
          <el-row v-if="formData.attributes.customs.length > 0" :gutter="15" type="flex" style="flex-wrap: wrap;">
            <el-col :xl="12" :lg="12" :sm="24" :xs="24" v-for="(customExtra, index) in formData.attributes.customs"
                    :key="customExtra.id">
              <el-form-item :label="customExtra.name" prop="custom">
                <el-select style="width: 100%;" v-model="formData.customs[index].value">
                  <el-option v-for="item in customExtra.custom"
                             :key="item.id"
                             :label="item.label"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="description" :label="$t('advertise.description')">
            <el-input type="textarea" :rows="10" :placeholder="$t('advertise.description')"
                      v-model="formData.description"></el-input> <!-- for validating -->
            <!-- <tinymce-editor style="display: none" api-key="6u2zs29r2mfts4ug14uf8nzj63k7hg6yp3vsddflen298dn2" v-model="formData.description"></tinymce-editor> -->
          </el-form-item>

          <!-- END ATTRIBUTES -->

          <!-- IMAGES -->
          <el-form-item>
            <el-row type="flex" justify="space-between" :gutter="50" style="flex-wrap: wrap">
              <el-col v-loading="images[0].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 0" class="image-box" @click="selectImageFile(0)">
                  <img v-if="images[0].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[0].url" alt="">

                  <div v-if="images[0].url">
                    <i @click="seeImage(images[0].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(0)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" type="file" id="imageFile0" ref="imageFile0"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[1].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 1" class="image-box" @click="selectImageFile(1)">
                  <img v-if="images[1].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[1].url" alt="">

                  <div v-if="images[1].url">
                    <i @click="seeImage(images[1].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(1)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile1" type="file" ref="imageFile1"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[2].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 2" class="image-box" @click="selectImageFile(2)">
                  <img v-if="images[2].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[2].url" alt="">

                  <div v-if="images[2].url">
                    <i @click="seeImage(images[2].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(2)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile2" type="file" ref="imageFile2"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[3].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 3" class="image-box" @click="selectImageFile(3)">
                  <img v-if="images[3].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[3].url" alt="">

                  <div v-if="images[3].url">
                    <i @click="seeImage(images[3].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(3)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile3" type="file" ref="imageFile3"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[4].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 4" class="image-box" @click="selectImageFile(4)">
                  <img v-if="images[4].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[4].url" alt="">

                  <div v-if="images[4].url">
                    <i @click="seeImage(images[4].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(4)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile4" type="file" ref="imageFile4"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[5].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 5" class="image-box" @click="selectImageFile(5)">
                  <img v-if="images[5].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[5].url" alt="">

                  <div v-if="images[5].url">
                    <i @click="seeImage(images[5].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(5)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile5" type="file" ref="imageFile5"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[6].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 6" class="image-box" @click="selectImageFile(6)">
                  <img v-if="images[6].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[6].url" alt="">

                  <div v-if="images[6].url">
                    <i @click="seeImage(images[6].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(6)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile6" type="file" ref="imageFile6"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>
              <el-col v-loading="images[7].loading" :xs="12" :sm="12" :md="6" :lg="6">
                <div :id="'image-box' + 7" class="image-box" @click="selectImageFile(7)">
                  <img v-if="images[7].url" width="100%" height="120"
                       style="border-radius: 4px; object-fit: cover; object-position: center;"
                       :src="$serverImageUrl + images[7].url" alt="">

                  <div v-if="images[7].url">
                    <i @click="seeImage(images[7].url)" class=el-icon-rank></i>
                    <i @click="deleteImage(7)" class="el-icon-delete"></i>
                  </div>

                  <i v-else class="fas fa-camera no-image-yet"></i>

                  <input accept=".png, .jpg, .jpeg" id="imageFile7" type="file" ref="imageFile7"
                         @change="onFileSelected" hidden>
                </div>
              </el-col>

            </el-row>
          </el-form-item>

          <el-form-item>
            <div id="map" style="width: 100%; height: 300px; z-index: 0;"></div>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- <el-col :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
          <div class="image-size-note">
              <span>{{$t('advertise.max_file_size')}} <b>5 MB</b></span>
          </div>
      </el-col> -->
      <!-- <el-col :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
          <h2 style="text-align: center;">{{$t('advertise.contact_info')}}</h2>
          <el-divider></el-divider>
      </el-col>               -->
    </el-row>
    <el-row type="flex" justify="center" style="flex-wrap: wrap;">
      <el-col :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
        <el-checkbox v-model="showTopForm" @change="makeTop" :label="$t('advertise.is_top')" border></el-checkbox>
      </el-col>
      <el-col :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
        <el-collapse-transition>
          <div v-show="showTopForm">
            <el-row :gutter="10" :key="updateKey">
              <el-col :xs="20" :sm="20" :md="8" :lg="8" style="margin-top: 1rem;" v-for="tariff in tariffs"
                      :key="tariff.id">
                <div @click="selectTariff(tariff)">
                  <el-card :body-style="{ padding: '0px' }" :shadow="tariff.shadow"
                           :style="`cursor: ${wasTop ? 'not-allowed' : 'pointer'}; height: 24rem;`">
                    <div slot="header" class="clearfix">
                      <span>{{ tariff.title }}</span>
                    </div>

                    <img height="125" width="125" :src="$serverImageUrl + tariff.image" class="image">

                    <div class="text">
                      <div>
                        <span>{{ $t('advertise.price') }}: </span> {{ tariff.price }} {{ $t('advertise.soum') }}
                      </div>

                      <div>
                        <span>{{ $t('advertise.day') }}: </span>
                        <span> {{ tariff.days }} {{ $t('advertise.day') }} </span>
                      </div>
                    </div>
                    <div @click.stop.once="makeInstagram(tariff.id)" style="display: flex">
                      <el-col>
                        <el-checkbox v-model="tariff.instagram"
                        :label="$t('advertise.isInstagram')" border>
                        </el-checkbox>
                      </el-col>
                      {{ tariff.instagramPrice }} {{ $t('advertise.soum') }}
                    </div>

                    <div class="text">
                      <div>
                        <span>{{ $t('advertise.generalPrice') }}: </span> {{ tariff.generalPrice }} {{ $t('advertise.soum') }}
                      </div>
                    </div>

                    <div style="float: right;  margin-right: 5px">
                      <transition name="el-zoom-in-center">
                        <div v-show="tariff.selected">
                          <el-button circle type="success" icon="el-icon-check"></el-button>
                        </div>
                      </transition>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </el-col>

    </el-row>

    <el-row type="flex" justify="center" style="flex-wrap: wrap; margin-top: .5rem">

      <el-col :xs="20" :sm="16" :md="13" :lg="13" :xl="13">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center">
          <span style="margin: .5rem 0">{{ $t('advertise.fields') }}<span
              style="color: red">*</span> - {{ $t('advertise.required') }}</span>
          <el-button @click="advertise" type="primary">{{ $t('advertise.make_announcement') }}</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog center :title="$t('basic.fill_balance')" :visible.sync="payDialogVisible" :width="`${size}%`">
      <!-- <el-row type="flex" justify="center" align="center" style="margin-bottom: 0.5rem;">
          <h2>Hisobni to`ldirish</h2>
      </el-row> -->

      <el-row style="margin: 0.5rem 0;">
        <el-form :model="paymentForm" ref="paymentForm">
          <el-form-item prop="dummy" :rules="paymentRules">
            <el-input id="currency-mask" placeholder="Summa" v-model="paymentForm.dummy"></el-input>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row type="flex" justify="center" :gutter="20">
        <el-col>
          <div @click="selectPaymentService(1)">
            <el-card :shadow="clickServiceSelected ? 'always' : 'hover'" :body-style="{ padding: '5px' }">
              <div slot="header" style="padding: 0 14px; float: right; margin-bottom: 0.5rem; height: 2rem">
                <transition name="el-zoom-in-center">
                  <div v-show="clickServiceSelected">
                    <el-button size="small" circle type="primary" icon="el-icon-check"></el-button>
                  </div>
                </transition>
              </div>
              <img src="@/assets/img_click.png" class="image">
            </el-card>
          </div>
        </el-col>
        <el-col>
          <div @click="selectPaymentService(2)">
            <el-card :shadow="paymeServiceSelected ? 'always' : 'hover'" :body-style="{ padding: '5px' }">
              <div slot="header" style="padding: 0 14px; float: right; margin-bottom: 0.5rem; height: 2rem">
                <transition name="el-zoom-in-center">
                  <div v-show="paymeServiceSelected">
                    <el-button size="small" circle type="primary" icon="el-icon-check"></el-button>
                  </div>
                </transition>
              </div>
              <img src="@/assets/img_pay_me.png" class="image">
            </el-card>
          </div>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-around" style="margin-top: 0.5rem">
        <el-button type="danger" @click="closePaymentDialog">{{ $t('basic.cancel') }}</el-button>
        <el-button type="primary" @click="redirectPayemntService">{{ $t('basic.fill') }}</el-button>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="$serverImageUrl + dialogImageUrl" alt="">
    </el-dialog>
  </el-container>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import {Message} from 'element-ui'
import IMask from 'imask'
import {constants} from 'crypto';
import {MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/display.css';
import Inputmask from "inputmask";
import VueUploadMultipleImage from 'vue-upload-multiple-image'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 2000)
}
export default {
  props: {
    adId: {
      type: String | Number,
      default: null
    }
  },
  components: {
    VueUploadMultipleImage,
    'tinymce-editor': Editor, // <- Important part
    Treeselect
  },
  data() {
    let checkCategory = (rule, value, callback) => {
      if (this.formData.categoryId && this.formData.categoryId.length > 0) {
        this.formData.dummyCategory = this.formData.categoryId.length;
        callback();
      } else if (this.formData.phoneCategoryId) {
        this.formData.dummyCategory = this.formData.phoneCategoryId;
        callback();
      } else if (this.formData.dummyCategory) {
        callback();
      } else {
        this.formData.dummyCategory = ''
        callback(new Error(this.$t('rules.required')))
      }
    };
    let checkRegion = (rule, value, callback) => {
      if (this.formData.regionId && this.formData.regionId.length > 0) {
        this.formData.dummyRegion = this.formData.regionId[0]
        callback();
      } else if (this.formData.phoneRegionId) {
        this.formData.dummyRegion = this.formData.phoneRegionId;
      } else {
        this.formData.dummyRegion = ''
        callback(new Error(this.$t('rules.required')))
      }
    };
    let checkNum = (rule, value, callback) => {
      const currentNum = this.formData.nums[this.activeNumIndex];

      const dummy = document.getElementById('num_' + currentNum.index).inputmask.unmaskedvalue();

      if (dummy === '') { //IMaskJS
        callback(new Error(this.$t('rules.required')));
      } else if (dummy < currentNum.min || dummy > currentNum.max) {
        let errorMsg = `qiymat ${currentNum.min} va ${currentNum.max} orasida bo'lishi kerak `;
        if (this.$store.state.mainLang == 'ru') {
          errorMsg = `значение должно быть от ${currentNum.min} до ${currentNum.max}`;
        }
        callback(new Error(errorMsg));
      } else {
        callback();
      }
    };
    let checkStr = (rule, value, callback) => {
      const currentStr = this.formData.strs[this.activeStrIndex];

      if (currentStr.dummy === '') {
        callback(new Error(this.$t('rules.required')));
      } else if (currentStr.dummy.length > currentStr.max || currentStr.dummy.length < currentStr.min) {
        let errorMsg = `qiymatning uzunligi ${currentStr.min} va ${currentStr.max} orasida bo'lishi kerak`;
        if (this.$store.state.mainLang == 'ru') {
          errorMsg = `значение должно быть от ${currentStr.min} до ${currentStr.max}`;
        }
        callback(new Error(errorMsg));
      } else {
        callback();
      }
    };
    return {
      images1: [],
      formImage: null,
      type: {
        items: [
          {
            value: 1,
            label: 'Ordinary'
          },
          {
            value: 2,
            label: 'vikup'
          },
        ],
        selected: 1
      },
      paymentRules: [
        {required: true, message: this.$t('rules.required'), trigger: 'blur'}
      ],
      paymentForm: {
        paymentSoum: '',
        dummy: 0
      },
      dummy: '',
      extras: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      phoneCategoryProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      size: 30,
      moneyInNeed: '',
      clickServiceSelected: true, //selected by default
      paymeServiceSelected: false,
      payDialogVisible: false,
      updateKey: 0,
      tariffs: [],
      selected: false,
      requestMethod: 'post',
      locationMap: undefined,
      mapMarker: undefined,
      adLocation: {
        lat: 0,
        lng: 0
      },
      formData: {
        prepay: '',
        month: '',
        monthly_payment: '',

        extras: {
          nums: [],
          strs: [],
          customs: []
        },
        title: '',
        price: '',
        ownerType: 0,
        categoryId: [],
        phoneCategoryId: null,
        phoneRegionId: null,
        regionId: undefined,
        description: '',
        currencyId: undefined,
        selectedTariff: {},
        dummyCategory: '',
        dummyRegion: '',
        dummyPrice: '',
        dummyPhone: '',
        email: '',
        isTop: false, // this is for clearifing if the product is already a top one
        isInstagram: 0,
        isTelegram: 0,

        attributes: {
          nums: [],
          strs: [],
          customs: []
        },
        nums: [],
        strs: [],
        customs: []
      },
      showTopForm: false,
      rules: {
        prepay: [
          {required: true, message: this.$t('rules.required'), trigger: 'blur'}
        ],

        monthly_payment: [
          {required: true, message: this.$t('rules.required'), trigger: 'blur'}
        ],

        month: [
          {required: true, message: this.$t('rules.required'), trigger: 'blur'}
        ],

        currencyId: [
          {required: true, message: this.$t('rules.required'), trigger: ['blur', 'change']}
        ],

        email: [
          {required: true, required: true, message: this.$t('rules.required'), trigger: ['blur']},
          {type: 'email', message: this.$t('rules.correct_email'), trigger: ['blur']}
        ],

        title: [
          {required: true, message: this.$t('rules.required'), trigger: 'blur'}
        ],

        dummyPrice: [
          {required: true, message: this.$t('rules.required'), trigger: 'blur'}
        ],

        dummyRegion: [
          {required: true, validator: checkRegion, trigger: ['change', 'blur', 'focus']}
        ],

        dummyCategory: [
          {required: true, validator: checkCategory, trigger: ['change', 'blur', 'focus']}
        ],

        description: [
          // {required: true, message: this.$t('rules.required'), trigger: 'blur'},
          // { validator: checkDescription, trigger: 'change'}
        ],

        dummyPhone: [
          {required: true, message: this.$t('rules.required'), trigger: 'blur'}
        ],

        num: [
          {required: true, validator: checkNum, trigger: 'blur'}
        ],
        str: [
          {required: true, validator: checkStr, trigger: 'blur'}
        ]
      },
      wasTop: false,
      formData2: {
        phone: '',
        email: '',
        name: '',
      },
      categoryProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad: this.categoryLazyLoad
      },
      regionProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: (node, resolve) => {
          let value = node.value ? node.value : 0;
          const metadata = {
            url: 'regions',

            params: {
              pId: value,
              lang: this.$store.state.mainLang,
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
      selectedCategoryId: '',
      attributeId: '',
      selectedCategories: [],
      selectedRegions: [],
      currencies: [],
      categories: [],
      rootRegions: [],
      allRegions: [],
      allCategories: [],
      notNesteCategories: [],
      notNestedRegions: [],
      //for 8 images
      images: [
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
        {
          loading: false,
          url: '',
          object: null
        },
      ],
      isFreeOrExchange: false,
      moneyInNeed: '1000',
      activeImageIndex: 0, // this for having control of the array of images
      dialogImageUrl: '',
      dialogVisible: false,
      content: '',
      ownerTypes: [
        {
          value: 0,
          label: this.$t('basic.company')
        },
        {
          value: 1,
          label: this.$t('basic.person')
        }
      ],
      selectedCategoryForInstallment: null,
      selectedOwnerType: 0,
      activeNumIndex: 0,
      activeStrIndex: 0,
      activeCustomIndex: 0,
      loading: false,
      generalPrice: 0,
    }
  },
  methods: {
    //     uploadImage(imageObj) {
    //   return new Promise((resolve, reject) => {
    //     let myData = new FormData();
    //     myData.append('image', imageObj);
    //     const metadata = {
    //       url: 'upload/image',
    //       method: 'post',
    //       params: {
    //         dir: 'products'
    //       },
    //       data: myData
    //     }
    //     this.$store.dispatch('setData', metadata).then(response => {
    //       resolve(response);
    //       console.log(response)
    //     }).catch(e => {
    //       reject();
    //     })
    //   })
    // },
    uploadImageSuccess(formData, index, fileList) {
      this.images = fileList
      this.activeImageIndex = index
      console.log('data', this.images1)
      // Upload image api
      return new Promise((resolve, reject) => {
        const metadata = {
          url: 'upload/image',
          method: 'post',
          params: {
            dir: 'products'
          },
          data: formData
        }
        this.$store.dispatch('setData', metadata).then(response => {
          resolve(response);
          console.log(response)
        }).catch(e => {
          reject();
        })
      })
    },
    beforeRemove (index, done, fileList) {
      console.log('index', index, fileList)
      var r = confirm("remove image")
      if (r == true) {
        done()
      } else {
      }
    },
    editImage (formData, index, fileList) {
      console.log('edit data', formData, index, fileList)
    },
    getCategoriesFromLS() {
      const categories = localStorage.getItem('categories');
      if (categories) {
        this.notNesteCategories = JSON.parse(categories);
      }
    },
    onCategorySelected(region) {
      if (this.$store.state.isMobileVersion) {
        let temp2 = '';
        if (Array.isArray(region)) {
          temp2 = [...region].pop();
        } else if (typeof region === 'object') {
          temp2 = region.id;
        }
        let temp = this.notNesteCategories.find(data => data.id == temp2);
        region = this.makeTree(temp, this.notNesteCategories);
        if (region.length == 2 && region[0] === region[1]) {
          region.pop();
        }
      }
      this.formData.dummyCategory = region[0];
      this.selectedCategoryId = [...region].pop();
      this.selectedCategoryForInstallment = this.notNesteCategories.find(data => {
        return data.id == this.selectedCategoryId;
      })
      this.isFreeOrExchange = (this.selectedCategoryId == 11 || this.selectedCategoryId == 12);
      const metadata = {
        url: 'attributes',
        params: {
          lang: this.$store.state.mainLang,
          id: region.join(',')
        }
      }
      this.$store.dispatch('getData', metadata)
          .then(response => {
            this.formData.attributes.nums = [];
            this.formData.attributes.strs = [];
            this.formData.attributes.customs = [];
            this.formData.nums = [];
            this.formData.strs = [];
            this.formData.customs = [];
            let numIndex = 0;
            let strIndex = 0;
            let customIndex = 0;
            for (let index = 0; index < response.length; index++) {
              const element = response[index];
              if (element.type == 1) { //number
                this.formData.attributes.nums.push(element);
                this.formData.nums.push({
                  value: undefined,
                  dummy: '',
                  min: element.min,
                  max: element.max,
                  index: numIndex++,
                  id: element.id
                });
              } else if (element.type == 2) { //string
                this.formData.attributes.strs.push(element);
                this.formData.strs.push({
                  value: undefined,
                  dummy: '',
                  index: strIndex++,
                  min: element.min,
                  max: element.max,
                  id: element.id
                });
              } else {//custom
                this.formData.attributes.customs.push(element);
                this.formData.customs.push({
                  value: 0,
                  id: element.id
                });
              }
            }
            let _customIndex2 = 0;
            this.formData.attributes.customs.forEach(data => {
              let _customIndex = 0;
              data.custom = data.customs.map(element => {
                return {
                  value: _customIndex++,
                  label: element[this.$store.state.mainLang],
                  id: element.id
                }
              });
              this.formData.customs[_customIndex2++].value = data.custom[0].id ? data.custom[0].id : 0;
            });
            setTimeout(() => {
              for (let index = 0; index < this.formData.nums.length; index++) {
                const element = this.formData.nums[index];
                // element.value = IMask(document.getElementById('num_' + index), {
                //     mask: Number,
                //     min: this.formData.attributes.nums[index].min,
                //     max: this.formData.attributes.nums[index].max,
                //     thousandsSeparator: ' '
                // })
                //let a = Inputmask({regex: `[-0-9]+{${this.formData.attributes.nums[index].min}, ${this.formData.attributes.nums[index].max}}`, placeholder: ''}).mask('num_' + index);
                let a = Inputmask({regex: `[0-9]*`, placeholder: ''}).mask('num_' + index);
              }
              if (this.adId) {
                for (let index = 0; index < this.extras.nums.length; index++) {
                  this.formData.nums[index].dummy = this.extras.nums[index].value;
                  this.formData.nums[index].id = this.extras.nums[index].id;
                  this.formData.nums[index].attributeId = this.extras.nums[index].attributeId;
                }
                for (let index = 0; index < this.extras.strs.length; index++) {
                  this.formData.strs[index].id = this.extras.strs[index].id;
                  this.formData.strs[index].dummy = this.extras.strs[index].value;
                  this.formData.strs[index].attributeId = this.extras.strs[index].attributeId;
                }
                for (let index = 0; index < this.extras.customs.length; index++) {
                  this.formData.customs[index].id = this.extras.customs[index].id;
                  this.formData.customs[index].value = parseInt(this.extras.customs[index].value);
                  this.formData.customs[index].attributeId = this.extras.customs[index].attributeId;
                }
              }
            }, 1000)
          })
          .catch(error => {
            console.log(error);
          })
    },
    isBan() {
      return new Promise((resolve, reject) => {
        const metadata = {
          url: 'user/ban',
          token: this.$store.state.userInfo.token
        }
        this.$store.dispatch('getData', metadata)
            .then(response => {
              if (!response) {
                resolve(response);
              } else {
                reject(response);
              }
            })
            .catch(error => {
              reject(error);
            })
      })
    },
    handleCategoryClick(data) { // for phone size screens, make tree of categoryIds
      let tree = [];
      if (this.adId) {
        let obj = {
          id: data.value,
          parentId: data.parentId
        }
        do {
          tree.push(obj.id);
          for (let index = 0; index < this.notNesteCategories.length; index++) {
            const element = this.notNesteCategories[index];
            if (obj.parentId == element.id) {
              obj.id = element.id;
              obj.parentId = element.parentId;
              break;
            }
          }
        } while (obj.parentId !== null);
        tree.push(obj.id);
      } else {
        let parentObj = {
          value: data.value,
          parent: data.parent
        }
        do {
          tree.push(parentObj.value);
          parentObj = parentObj.parent;
        } while (parentObj !== null);
      }
      this.formData.phoneCategoryId = tree.reverse();
    },
    loadNode(node, resolve) {
      let value = node.data && node.data.value ? node.data.value : null;
      const metadata = {
        url: 'categories',
        params: {
          pId: value,
          lang: this.$store.state.mainLang,
        }
      }
      this.$store.dispatch('getData', metadata).then(response => {
        let nodes = [];
        if (value) {
          nodes = response.map(the_node => ({
            value: the_node.id,
            name: the_node.name,
            parent: node.data
          }))
        } else {
          nodes = response.filter(the_node => {
            return the_node.parentId === null;
          }).map(the_node => ({
            value: the_node.id,
            name: the_node.name,
            parent: node.data
          }))
        }
        resolve(nodes);
      })
    },
    openPaymendDialog() {
      this.payDialogVisible = true;
      setTimeout(() => {
        this.paymentForm.paymentSoum = IMask(
            document.getElementById('currency-mask'),
            {
              mask: Number,
              min: 1000,
              max: 10000000,
              thousandsSeparator: ' '
            }
        )
        this.paymentForm.dummy = this.moneyInNeed > '1000' ? this.moneyInNeed : '1000';
      }, 1000)
    },
    closePaymentDialog() {
      this.paymentForm.dummy = 0;
      this.payDialogVisible = false;
    },
    redirectPayemntService() {
      this.$refs.paymentForm.validate(valid => {
        if (valid) {
          this.paymentLoading = true;
          const metadata = {
            url: 'checkout',
            params: {
              amount: this.paymentForm.paymentSoum.unmaskedValue * 100, // the server need every single amount of money
              method: this.clickServiceSelected ? 1 : 0 // click is 1 payme is 0
            },
            token: this.$store.state.userInfo.token
          }
          this.$store.dispatch('getData', metadata).then(response => {
            window.location = response;
          }).catch(error => {

          })
              .finally(() => {
                this.paymentLoading = true;
              })
        }
      })
    },
    selectPaymentService(value) {
      // value 1 -> Click
      // value 2 -> Payme
      if (value == 1) {
        this.paymeServiceSelected = false;
        this.clickServiceSelected = true;
      } else {
        this.clickServiceSelected = false;
        this.paymeServiceSelected = true;
      }
    },
    makeTop(value) {
      if (!value) {
        for (let index = 0; index < this.tariffs.length; index++) {
          const tariff = this.tariffs[index];
          tariff.shadow = 'hover';
          tariff.selected = false;
        }
        this.formData.selectedTariff.id = -1;
        this.formData.selectedTariff.balance = 0;
      } else {
        this.tariffs[0].selected = true;
        this.tariffs[0].shadow = 'always';
        this.formData.selectedTariff.id = this.tariffs[0].id;
      }
    },
    makeTelegram(id) {
      let tariff = this.tariffs.find(t => t.id === id);
      if (tariff) {
        this.tariffs.forEach(t => {
          if (t.id !== id) {
            t.selected = false;
            t.telegram = false;
            t.instagram = false;
          }
        })
        tariff.telegram = !tariff.telegram;
        tariff.selected = true;
      }
    },
    makeInstagram(id) {
      let tariff = this.tariffs.find(t => t.id === id);
      if (tariff) {
        this.tariffs.forEach(t => {
          if (t.id !== id) {
            t.selected = false;
            t.telegram = false;
            t.instagram = false;
          }
        })
        tariff.instagram = !tariff.instagram;
        tariff.selected = true;

        if (tariff.instagram) {
          tariff.generalPrice = tariff.generalPrice + tariff.instagramPrice;
        } else {
          tariff.generalPrice = tariff.price;
        }
      }
    },
    testClick() {
      console.log('click men')
    },
    selectTariff(item) {
      if (this.wasTop) {
        Message({
          type: 'error',
          message: this.$t('advertise.cannot_change_tariff'),
          duration: 5000
        })
        return;
      }
      for (let index = 0; index < this.tariffs.length; index++) {
        const tariff = this.tariffs[index];
        tariff.shadow = 'hover';
        tariff.selected = false;
        if (tariff.id !== item.id) {
          tariff.telegram = false;
          tariff.instagram = false;
        }
      }
      item.selected = !item.selected;
      item.shadow = 'always';
      this.formData.selectedTariff = item;
      this.updateKey++;
    },
    upgradeAdvertisement(productId, rateId, isInstagram) {
      const metadata = {
        url: 'addtop',
        data: {
          id: productId,
          rateId,
          isInstagram
        },
        method: 'post'
      }
      this.$store.dispatch('setData', metadata)
          .then(response => {
            let message = this.$t('advertise.ad_success');
            if (this.adId) {
              message = this.$t('advertise.ad_update_success')
            }
            Message({
              type: 'success',
              message: message,
              duration: 5000
            });
            this.clearFormData();
            this.getProfileData();
            this.$router.push({name: 'profile', params: {activeTab: 2}});
          })
          .catch(error => {
            console.log("ERROR: " + error)
            Message({
              type: 'error',
              message: this.$t('advertise.cannot_send_to_server'),
              duration: 5000
            })
          })
          .finally(() => {
            this.loading = false;
            document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
          })
    },
    getTariffs() {
      const metadata = {
        url: 'rates',
        params: {
          lang: this.$store.state.mainLang,
        },
        token: this.$store.state.userInfo.token
      }
      this.$store.dispatch('getData', metadata)
          .then(response => {
            this.tariffs = response;

            this.tariffs.forEach(tariff => {
              tariff.selected = false;
              tariff.shadow = 'hover';
              tariff.telegram = false;
              tariff.instagram = false;
              tariff.generalPrice = tariff.price;
            })
            this.tariffs[0].selected = true;
            this.tariffs[0].shadow = 'always';
          })
    },
    categoryLazyLoad(node, resolve) {
      let value = node.value ? node.value : null;
      const metadata = {
        url: 'categories',
        params: {
          pId: value,
          lang: this.$store.state.mainLang,
        }
      }
      this.$store.dispatch('getData', metadata)
          .then(response => {
            let nodes = [];
            if (value) {
              nodes = response.map(node => ({
                value: node.id,
                label: node.name,
                leaf: node.isLast
              }))
            } else {
              nodes = response.filter(node => {
                return node.parentId === null;
              }).map(node => ({
                value: node.id,
                label: node.name,
                leaf: node.isLast
              }))
            }
            resolve(nodes);
          })
    },
    onLocationChosen(location) {
      this.adLocation = location.latlng;
      if (this.mapMarker !== undefined) {
        this.locationMap.removeLayer(this.mapMarker);
      }
      this.mapMarker = L.marker([location.latlng.lat, location.latlng.lng]).addTo(this.locationMap)
          .bindPopup(`<b>${this.formData.title}</b>`).openPopup();                        //${this.$t('advertise.popup')}.
    },
    drawMap() {
      const location = {
        lat: this.adLocation.lat ? this.adLocation.lat : 41.311081,
        lng: this.adLocation.lng ? this.adLocation.lng : 69.240562
      }
      this.locationMap = L.map('map', {
        zoomControl: true,
        fullscreenControl: true,
      }).setView([location.lat, location.lng], 13.5);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution:
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(this.locationMap);
      if (this.adLocation.lat && this.adLocation.lng) {
        const location = {
          latlng: this.adLocation
        }
        this.onLocationChosen(location);
      }
      this.locationMap.addEventListener('click', this.onLocationChosen);
    },
    getData(id) {
      this.loading = true;
      const metadata = {
        url: 'product',
        params: {
          lang: this.$store.state.mainLang,
          productId: id
        }
      }
      this.$store.dispatch('getData', metadata)
          .then(response => {
            this.type.selected = response.product.type;
            if (response.product.type == 2) {
              this.formData.month = response.product.month;
              this.formData.prepay = response.product.prepay;
              this.formData.monthly_payment = response.product.monthly_payment;
            }
            this.requestMethod = 'put';
            this.formData.title = response.product.name;
            this.formData.dummyPrice = response.product.price;
            this.formData.currencyId = response.currency.id;
            this.formData.description = response.product.description;
            //this.formData.ownerType = response.product.type;
            this.adLocation = response.product.location;
            if (response.product.images) {
              for (let index = 0; index < response.product.images.length; index++) {
                const image = response.product.images[index];
                this.images[index].url = image;
              }
            }
            this.formData.categoryId = response.categories.map(category => {
              return category.id;
            })
            this.formData.regionId = response.regions.map(region => {
              return region.id;
            })
            for (let index = 0; index < response.extras.length; index++) {
              const element = response.extras[index];
              if (element.type == 1) {
                this.formData.extras.nums.push(element);
              } else if (element.type == 2) {
                this.formData.extras.strs.push(element);
              } else {
                this.formData.extras.customs.push(element);
              }
            }
            this.extras = this.formData.extras;
            this.selectedCategoryId = [...this.formData.categoryId].pop();
            this.formData.phoneCategoryId = [...this.formData.categoryId].pop();
            this.formData.phoneRegionId = [...this.formData.regionId].pop();
            if (this.formData.categoryId.length > 0) {
              this.formData.dummyCategory = this.formData.categoryId[0];
            }
            if (this.formData.regionId.length > 0) {
              this.formData.dummyRegion = this.formData.regionId[0];
            }
            if (response.product.rateId) { // ad is top
              this.showTopForm = true;
              let tariff = this.tariffs.find(tariff => {
                return response.product.rateId == tariff.id;
              })
              this.selectTariff(tariff);
              this.wasTop = true;
              this.formData.isTop = true;
            } else {
              this.formData.isTop = false;
            }
            this.onCategorySelected(this.formData.categoryId);
            this.drawMap();
          })
          .catch(error => {

          })
          .finally(() => {
            this.loading = false;
          })
    },
    makeStringOfCommas(array) {
      let string = '';
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        string += element;
        if (index < array.length - 1) {
          string += ','
        }
      }
      return string;
    },
    getProfileData() {
      const metadata = {
        url: 'user',
        token: this.$store.state.userInfo.token
      }
      this.$store.dispatch('getData', metadata).then(response => {
        //this.$store.commit('SET_USER_INFO', response);
      })
          .catch(error => {

          })
    },
    makeTree(data, items) {
      let tree = [];
      let obj = {
        id: data.id,
        parentId: data.parentId
      }
      let index = 0;
      do {
        index++;
        tree.push(obj.id);
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (obj.parentId === element.id) {
            obj.id = element.id;
            obj.parentId = element.parentId;
            break;
          }
        }
      } while (index < 1000);
      tree.push(obj.id);
      return tree.reverse();
    },
    getCurrencies() {
      const metadata = {
        url: 'currencies',
        params: {
          lang: this.$store.state.mainLang,
        }
      }
      this.$store.dispatch('getData', metadata)
          .then(response => {
            this.currencies = response.map((currency) => {
              return {
                value: currency.id,
                label: currency.name,
              }
            })
          })
          .then(() => {
            this.formData.currencyId = this.currencies[0].id;
          })
    },
    advertise() {
      this.$refs.contactInfo.validate(); // for the user to see, if the first fomrData is not correctly filled then the second formData cannot be validated
      this.$refs.adInfo.validate((valid) => {
        if (valid) {
          this.tariffs.forEach(t => {
            if (t.instagram === true) {
              this.formData.isInstagram = 1;
            }
          })
          if (this.formData.selectedTariff.id > 0 && (parseInt(this.formData.selectedTariff.price) > parseInt(this.$store.state.userInfo.balance))) {
            Message({
              type: "error",
              message: this.$t('advertise.balance_not_enough'),
              duration: 5000
            });
            var instagramPrice = 0;

            if (this.formData.isInstagram === 1) {
              let tariff = this.tariffs.find(t => t.id === this.formData.selectedTariff.id);
              if (tariff) {
                instagramPrice = tariff.instagramPrice;
              }
            }

            this.moneyInNeed = (parseInt(this.formData.selectedTariff.price) + parseInt(instagramPrice)) - parseInt(this.$store.state.userInfo.balance);
            this.openPaymendDialog();
            return;
          }
          this.loading = true;
          let images = [];
          for (let index = 0; index < this.images.length; index++) {
            const element = this.images[index];
            if (element.url) {
              images.push(element.url);
            }
          }
          let regionId = [];
          if (this.$store.state.isMobileVersion) {
            if (this.formData.phoneRegionId) {
              let temp = this.notNestedRegions.find((data) => {
                return data.id == this.formData.phoneRegionId;
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
            regionId = this.formData.regionId ? this.formData.regionId.join(',') : null;
          }
          let categoryId = [];
          if (this.$store.state.isMobileVersion) {
            if (this.formData.phoneCategoryId) {
              let temp = this.notNesteCategories.find((data) => {
                return data.id == this.formData.phoneCategoryId;
              });
              let temp2 = 0;
              do {
                temp2++;
                for (let index = 0; index < this.notNesteCategories.length; index++) {
                  const element = this.notNesteCategories[index];
                  if (element.id == temp.parentId) {
                    categoryId.push(temp.id);
                    temp = element;
                    break;
                  }
                }
              } while (temp.parentId == 0 || temp.parentId);
              categoryId.push(temp.id);
              categoryId = categoryId.reverse();
              categoryId = categoryId.join(',');
            }
          } else {
            categoryId = this.formData.categoryId ? this.formData.categoryId.join(',') : null;
          }
          let extras = [];
          for (let index = 0; index < this.formData.nums.length; index++) {
            const element = this.formData.nums[index];
            const dummy = document.getElementById('num_' + element.index).inputmask.unmaskedvalue();
            if (this.requestMethod === 'post') {
              extras.push({
                type: 1,
                value: dummy,
                categoryId: this.selectedCategoryId,
                attributeId: element.id
              })
            } else {
              extras.push({
                type: 1,
                value: dummy,
                categoryId: this.selectedCategoryId,
                id: element.id,
                attributeId: element.attributeId
              })
            }
          }
          for (let index = 0; index < this.formData.strs.length; index++) {
            const element = this.formData.strs[index];
            if (this.requestMethod === 'post') {
              extras.push({
                type: 2,
                value: element.dummy,
                categoryId: this.selectedCategoryId,
                attributeId: element.id
              })
            } else {
              extras.push({
                type: 2,
                value: element.dummy,
                categoryId: this.selectedCategoryId,
                attributeId: element.attributeId,
                id: element.id
              })
            }
          }
          for (let index = 0; index < this.formData.customs.length; index++) {
            const element = this.formData.customs[index];
            if (this.requestMethod === 'post') {
              extras.push({
                type: 3,
                value: element.value,
                categoryId: this.selectedCategoryId,
                attributeId: element.id
                //attributeId: element.attributeId
              })
            } else {
              extras.push({
                type: 3,
                value: element.value,
                categoryId: this.selectedCategoryId,
                id: element.id,
                attributeId: element.attributeId
              })
            }
          }
          let price = 0;
          if (!Number.isNaN(this.formData.dummyPrice)) {
            price = this.formData.dummyPrice;
          } else {
            price = this.formData.dummyPrice.replace(/ /g, '');
          }
          price = parseInt(price);
          const product = {
            id: this.adId,
            type: this.type.selected,
            categoryId,
            regionId,
            currencyId: this.formData.currencyId,
            //contactName: this.formData2.name,
            description: this.formData.description,
            // type: this.formData.ownerType,
            price,
            name: this.formData.title,
            //contactPhone: this.formData.dummyPhone,
            //contactEmail: this.formData.email,
            location: this.adLocation,
            images: images.length > 0 ? images : null,
            isInstagram: this.formData.isInstagram
          }
          if (this.type.selected == 2) {
            const month = document.getElementById('month').inputmask.unmaskedvalue();
            const prepay = document.getElementById('prepay').inputmask.unmaskedvalue();
            const monthly_payment = document.getElementById('monthly_payment').inputmask.unmaskedvalue();
            product.month = month;
            product.prepay = prepay;
            product.monthly_payment = monthly_payment;
          }
          const metadata = {
            url: 'product',
            method: this.requestMethod,
            data: {
              product,
              extras
            },
            token: this.$store.state.userInfo.token
          }
          this.$store.dispatch('setData', metadata)
              .then(response => {
                if (this.formData.selectedTariff.id >= 0 && !this.formData.isTop) {
                  this.upgradeAdvertisement(this.requestMethod == 'post' ? response.id : this.adId, this.formData.selectedTariff.id, this.formData.isInstagram);
                } else {
                  let message = this.$t('advertise.ad_success');
                  if (this.adId) {
                    message = this.$t('advertise.ad_update_success')
                  }
                  Message({
                    type: 'success',
                    message: message,
                    duration: 5000
                  });
                  this.clearFormData();
                  this.getProfileData();
                  this.$router.push({name: 'profile', params: {activeTab: 2}});
                  document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
                  this.loading = false;
                }
              })
              .catch(error => {
                Message({
                  type: 'error',
                  message: this.$t('advertise.cannot_send_to_server'),
                  duration: 5000
                })
                document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
                this.loading = false;
              })
        } else {
          Message({
            type: 'error',
            message: this.$t('advertise.fill_form_error'),
            duration: 5000
          })
          document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      })
    },
    clearFormData() {
      this.formData.title = '';
      this.formData.price = '';
      this.formData.ownerType = 0;
      this.formData.categoryId = undefined;
      this.formData.regionId = undefined;
      this.formData.description = '';
      this.formData.currencyId = undefined;
      this.wasTop = false;
      this.formData.isInstagram = 0;
      this.formData.isTelegram = false;
      for (let index = 0; index < this.images.length; index++) {
        const image = this.images[index];
        image.url = '';
        image.object = null;
        image.loading = false;
      }
    },
    loadOptions({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        for (let index = 0; index < this.categories.length; index++) {
          const element = this.categories[index];
          if (element.id == parentNode.parentId) {
            this.selectedCategories = [];
            this.selectedCategories.push(element.id);
            break;
          }
        }
        const metadata = {
          url: 'categories',
          params: {
            pId: parentNode.id,
            lang: this.$store.state.mainLang,
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
    loadRegionsOptions({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
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
            lang: this.$store.state.mainLang,
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
    selectImageFile(index) {
      this.activeImageIndex = index;
      if (!this.images[index].url) {
        this.$refs['imageFile' + index].click();
      }
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
    getCategories() {
      const metadata = {
        url: 'categories',
        params: {
          lang: this.$store.state.mainLang,
        }
      }
      this.$store.dispatch('getData', metadata)
          .then(response => {
            this.notNesteCategories = response;
            localStorage.setItem('categories', JSON.stringify(this.notNesteCategories));
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
    seeImage(imageUrl) {
      this.dialogImageUrl = imageUrl;
      this.dialogVisible = true;
    },
    onFileSelected(event) {
      this.images[this.activeImageIndex].loading = true;
      this.images[this.activeImageIndex].object = event.target.files[0];
      let input = document.getElementById('imageFile' + this.activeImageIndex).files;
      if (input[0].size > 1048576) {
        this.$message({
          type: 'warning',
          message: this.$t('basic.max_filesize')
        })
        this.images[this.activeImageIndex].loading = false;
        return;
      }
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.uploadImage(this.images[this.activeImageIndex].object)
            .then(response => {
              this.images[this.activeImageIndex].url = response;
              this.images[this.activeImageIndex].loading = false;
            })
      });
      fileReader.readAsDataURL(this.images[this.activeImageIndex].object);
      document.getElementById('image-box' + this.activeImageIndex).style.cursor = 'default';
    },
    deleteImage(index) {
      let image = document.getElementById('image-box' + index).getElementsByTagName('img')[0];
      image.style.transition = '1s';
      image.style.transform = 'translateY(-101%)';
      setTimeout(() => {
        this.images[index].url = '';
        this.images[index].object = null;
      }, 1000);
    },
    getRegions() {
      const metadata = {
        url: 'regions',
        params: {
          lang: this.$store.state.mainLang,
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
    },
  },
    created() {
      this.getCategories();
    this.getCategoriesFromLS();
    this.isBan().then(result => {
      if (result === null) {
        var im = new Inputmask({regex: '[0-9]+', placeholder: ''}).mask(document.getElementById("price"));
        new Inputmask({regex: '[1-9][0-9]', placeholder: ''}).mask(document.getElementById("month"));
        new Inputmask({
          regex: '[+-]?([0-9]*[.])?[0-9]+',
          placeholder: ''
        }).mask(document.getElementById("monthly_payment"));
        new Inputmask({regex: '[+-]?([0-9]*[.])?[0-9]+', placeholder: ''}).mask(document.getElementById("prepay"));
        if (this.adId) { // this means that an ad is going to be editted
          setTimeout(() => {
            this.getData(this.adId);
          }, 1000)
        } else {
          this.drawMap();
        }
        this.getRegions();
        this.getCurrencies();
        this.getTariffs();
        this.formData.isTop = false;
      } else {
        Message({
          type: 'warning',
          message: this.$t('basic.in_ban'),
          duration: 5000
        })

        this.$router.push({name: 'home'});
      }
    })
        .catch(error => {
          console.log(error)
        })
  },
  watch: {
    'formData.phoneRegionId': function (value) {
      this.formData.dummyRegion = value;
    }
  }

}
</script>
<style lang="scss">
@import '../custom.scss';
.el-radio.is-bordered.is-checked {
    border-color: #0fec98;
    background: #0fec98;
}
.el-radio__input.is-checked + .el-radio__label {
    color: white;
    font-weight: 700;
}
.el-radio__input.is-checked .el-radio__inner {
    border-color: white;
    background: white;
}
.el-divider--horizontal {
  margin-top: .5rem !important;
  margin-bottom: 1rem !important;
}

.el-form--label-top, .el-form-item__label {
  padding: 0 !important;
  margin-bottom: 0;
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

.image-box {
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
@media (max-width: 992px) {
  .el-radio__label{
    font-size: 12px !important;
  }
}

</style>
