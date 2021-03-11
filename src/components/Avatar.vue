<template>

<v-img
  :src="getUrl"
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
  data: () => ({
  }),
  computed: {
    ...mapState([
      'username', 'email',
      'firstName', 'lastName',
    ]),
    getUrl() {
      const text = this.$store.state.firstName[0]
        + this.$store.state.lastName[0];
      const url = svgToDataURL(getSvg(
        text, 64, this.$store.state.email));

      return url;
    },
  },
};

</script>
