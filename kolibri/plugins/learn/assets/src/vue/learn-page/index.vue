<template>

  <div>
    <page-header :title="$tr('learnName')">
      <mat-svg slot="icon" category="action" name="home"/>
    </page-header>
    <allcontent/>
    <expandable-content-grid
      :contents="recommendations.popular"
      :title="'Most Popular'"/>
    <expandable-content-grid
      :contents="recommendations.nextSteps"
      :title="'Next Steps'"/>
    <expandable-content-grid
      :contents="recommendations.resume"
      :title="'Resume'"/>
  </div>

</template>


<script>

  module.exports = {
    $trNameSpace: 'learnIndex',
    $trs: {
      learnName: 'Recommended',
    },
    components: {
      'page-header': require('../page-header'),
      'allcontent': require('./allcontent'),
      'expandable-content-grid': require('../expandable-content-grid'),
    },
    vuex: {
      getters: {
        recommendations: state => state.pageState.recommendations,
      },
    },
  };

</script>


<style lang="stylus" scoped></style>
