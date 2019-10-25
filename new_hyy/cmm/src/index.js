import cmmStore from './vuex/';

import cmmRegComponents from 'cmmSrc/util/cmmRegComponents';
import cmmRoutes from 'cmmSrc/router/';
import cmmRouterView from './views/marketing.vue';
import cinemaDialog from './dialogs/cinema/cinemaDialog.vue';
import projectionEffectDialog from './dialogs/projectionEffect/projectionEffectDialog.vue';
import filmDialog from './dialogs/film/filmDialog.vue';
import filmTypeDialog from './dialogs/filmType/filmTypeDialog.vue';
import cinemaTypeDialog from './dialogs/cinemaType/cinemaTypeDialog.vue';
import tradeChannelDialog from './dialogs/tradeChannel/tradeChannelDialog.vue';
import approvalDialog from './dialogs/approval/approvalDialog.vue';

export {
  cmmRoutes,
  cmmStore,
  cmmRegComponents,
  cmmRouterView,
  cinemaDialog,
  projectionEffectDialog,
  filmDialog,
  filmTypeDialog,
  cinemaTypeDialog,
  tradeChannelDialog,
  approvalDialog
};
