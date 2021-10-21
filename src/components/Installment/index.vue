<template>
    <div style="background: #729F40; color: white; padding: .3em; border-radius: 3px; font-size: 12px">
        <span>{{$t('perMonth')}}</span>
        <span style="margin-left: .2em">{{monthlyPayment}}</span>
        <span style="margin-left: .1em">{{currency}}</span>        
    </div>
</template>

<script>
export default {
    props: {
        monthlyPayment: {
            type: String | Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        }
    } 
}
</script>