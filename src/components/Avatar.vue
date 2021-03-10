<template>

<v-img
  :src="url"
  :max-width="size"
  :max-height="size"
></v-img>

</template>
<script>
import UIAvatarSvg from 'ui-avatar-svg';
import svgToDataURL from 'svg-to-dataurl';
import {mapState} from 'vuex';
import stringToColor from '@/lib/stringToColor';

function getSvg(text, size, colorBase) {
  const svg = (new UIAvatarSvg())
    .text(text)
    .size(size)
    .bgColor(stringToColor(colorBase))
    .textColor('#ffffff')
    .generate();

  return svg;
}

export default {
  props: ['size'],
  data() {
    const text = this.$store.state.userData.first_name[0]
      + this.$store.state.userData.last_name[0];
    return {
      url: svgToDataURL(getSvg(
        text, 64, this.$store.state.userData.email)),
    };
  },
  computed: {
    ...mapState(['userData']),
  },
  methods: {
    stringToColor,
  },
};

</script>
