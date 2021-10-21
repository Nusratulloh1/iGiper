<template>
    <div>
        <ads></ads>
    </div>
</template>

<script>
    import Ads from "../Mobile/Ads"

    export default {
        name: "AnnouncementActive",
        components: {
            Ads,
        },
        data() {
            return {
                addType: {
                    type: 1,
                    required: false,
                }
            }
        }
    }
</script>

<style scoped>

</style>