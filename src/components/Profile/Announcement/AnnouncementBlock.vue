<template>
    <div class="intelegience">
        <div class="intelegience-block p-3 general-text">
            <a class="tab-toggle"
               :class="{ 'tab-toggle--active': currentComponent == 'AnnouncementActive' }"
               @click.prevent="currentComponent = 'AnnouncementActive'" @click="handleAds(1)">
                {{$t('basic.active')}}
            </a>

            <a class="tab-toggle"
               :class="{ 'tab-toggle--active': currentComponent == 'AnnouncementNeActive' }"
               @click.prevent="currentComponent = 'AnnouncementNeActive'" @click="handleAds(2)">
                {{$t('basic.inactive')}}
            </a>

            <a class="tab-toggle"
               :class="{ 'tab-toggle--active': currentComponent == 'NeConfirm' }"
               @click.prevent="currentComponent = 'NeConfirm'" @click="handleAds(3)">
                {{$t('basic.not_confirmed')}}
            </a>
        </div>

        <div class="intelegience-block-information general-text">
            <div class="content-tabs">
                <div class="p-4 bg-white border">
                    <keep-alive>
                        <component :is="currentComponent"></component>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AnnouncementActive from "./AnnouncementActive";
    import AnnouncementNeActive from "./AnnouncementNeActive";
    import NeConfirm from "./NeConfirm";

    export default {
        name: "AnnouncementBlock",
        data() {
            return {
                currentComponent: 'AnnouncementActive',
                lang: {},
            }
        },
        components: {
            AnnouncementActive,
            AnnouncementNeActive,
            NeConfirm
        },
        methods: {
            handleAds(val) {
                this.$store.commit('commitAddAds', val);
            },
        },
        // computed: {
        //     currentProperties: function () {
        //         if (this.currentComponent === 'AnnouncementActive') {
        //             return {
        //                 addType: {
        //                     type: 1,
        //                     required: true,
        //                 }
        //             };
        //         }
        //     }
        // }
    }
</script>

<style scoped lang="scss">
    .intelegience {

        &-block {
            display: flex;
            justify-content: space-between;
        }
    }

    .tab-toggle {
        position: relative;
        color: rgba(0, 0, 0, 0.6);

        &--active {

            &::after {
                content: "";
                position: absolute;
                top: 29px;
                left: -8%;
                width: 115% !important;
                height: 2px;
                border-radius: 10px;
                background-color: rgb(253, 168, 43);
                transition: all 0.2s ease-out;
            }
        }

        &::after {
            content: "";
            position: absolute;
            top: 25px;
            left: -8%;
            width: 0%;
            height: 2px;
            border-radius: 10px;
            background-color: rgb(253, 168, 43);
            transition: all 0.2s ease-out;
        }

        &:hover {
            color: rgb(253, 168, 43);
            cursor: pointer;
            text-decoration: none;
        }
    }

    .content-tabs {
        color: rgba(0, 0, 0, 0.6);
    }
</style>