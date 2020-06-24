<template>
  <v-container>
    <v-row class="content">
      <v-row class="house-header d-flex justify-space-around">
        <div style="width:40%;" height="30">
          <v-select
            v-model="property_active"
            :hint="`${property_active.name}, ${property_active.id}`"
            :items="propertyList"
            item-value="id"
            item-text="name"
            label="楼盘"
            hide-details="true"
            outlined
            dense
            return-object
            persistent-hint
          >
          </v-select>
        </div>
        <div style="width:40%;">
          <v-select
            v-model="building_active"
            :hint="`${building_active.name}, ${building_active.id}`"
            :items="buildingList"
            item-value="id"
            item-text="name"
            label="楼栋"
            hide-details="true"
            outlined
            dense
            return-object
            persistent-hint
          >
          </v-select>
        </div>
      </v-row>
      <v-row class="item-detail">
        <v-row
          v-for="(item, index) in currentList"
          :key="index"
          class="item d-flex"
          style="width: 100%;"
        >
          <v-col :cols="item && item[0].is_car ? '12' : '2'" class="left">
            {{ index }}层
          </v-col>
          <v-col
            :cols="item && item[0].is_car ? '12' : '10'"
            class="right d-flex justify-start  text-center flex-wrap"
          >
            <div
              v-for="(m, i) in item"
              :key="i"
              :class="m.status == 0 ? 'can-sale' : ''"
              @click="goBuildingDetail(m)"
            >
              {{ m.room_num }}
            </div>
          </v-col>
        </v-row>
      </v-row>

      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :timeout="2000"
        :top="true"
      >
        {{ text }}
      </v-snackbar>
    </v-row>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="draw-content">
        <v-toolbar dark color="primary">
          <v-spacer class="text-center">房源信息</v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false">关闭</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row class="d-flex justify-start item-color">
          <v-col cols="12" class="d-flex justify-start  flex-wrap">
            <v-col cols="5">
              <v-text-field
                label="楼盘名称"
                disabled
                :value="property_active.name || '无'"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                :label="currentItemDetail.is_car ? '车位号' : '房号'"
                disabled
                :value="currentItemDetail.room_num || '无'"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                :label="currentItemDetail.is_car ? '类型' : '户型'"
                disabled
                :value="
                  `${
                    !currentItemDetail.is_car
                      ? currentItemDetail.unit_type
                      : currentItemDetail.set_type == 1
                      ? '标准'
                      : '子母'
                  }`
                "
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="楼层"
                disabled
                :value="currentItemDetail.floor || '无'"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="预测绘面积"
                disabled
                :value="currentItemDetail.area || '无'"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="单价"
                disabled
                :value="currentItemDetail.unit_price || '无'"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="总价"
                disabled
                :value="currentItemDetail.price || '无'"
              ></v-text-field>
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import api from "@/api/apis";
import $ from "../../utils/util";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      text: "",
      snackbarColor: "",
      snackbar: false,
      property_active: {},
      propertyList: [],
      building_active: {},
      buildingList: [],
      currentList: [],
      currentItemDetail: {},
      dialog: false,
      sound: true,
      widgets: false,
    };
  },
  watch: {
    building_active() {
      this.getItemList();
    },
    property_active() {
      this.getBuilding();
    },
  },
  created() {
    this.getProperty();
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  computed: {},
  methods: {
    getProperty() {
      axios.get(`${api.getProperty}`).then((res) => {
        if (res.data.code == 4010) {
          this.text = "身份信息已失效，请重新登录";
          this.snackbar = true;
          this.snackbarColor = "red";
          this.$router.push("/login");
        } else if (res.data.code == 2000) {
          this.propertyList = res.data.data;
          this.property_active = res.data.data[0];
          // this.getBuilding();
        }
      });
    },
    getBuilding() {
      axios
        .get(`${api.getBuilding}?community=${this.property_active.id}`)
        .then((res) => {
          this.buildingList = res.data.data;
          this.building_active = res.data.data[0];
        });
    },
    getItemList() {
      axios
        .get(`${api.getItemList}?build_num=${this.building_active.id}`)
        .then((res) => {
          this.currentList = res.data.data;
        });
    },
    goBuildingDetail(val) {
      if (val.status === 0) {
        axios.get(`${api.getItemList}${val.id}/`).then((res) => {
          if (res.data.code == 4010) {
            this.text = "身份信息已失效，请重新登录";
            this.snackbar = true;
            this.snackbarColor = "red";
            this.$router.push("/login");
          } else if (res.data.code == 2000) {
            this.currentItemDetail = res.data.data;
            this.dialog = true;
          }
        });
      } else {
        return;
      }
    },
  },
};
</script>
<style scope lang="scss">
.container {
  padding: 0;
  height: 100%;
  width: 100%;
  .row {
    margin: 0;
  }
  .v-input {
    font-size: 12px;
  }
  .house-header {
    padding: 10px;
  }
  .item-detail {
    height: calc(100% - 61px);
    .col2,
    .col,
    .col3,
    .col10 {
      padding: 0;
    }
  }
  .item {
    display: block;
  }
  .left {
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    font-size: 13px;
    background-color: #49c2c7;
    height: 26px;
    line-height: 26px;
    text-align: center;
  }
  .right {
    font-size: 12px;
    div {
      height: 26px;
      line-height: 26px;
      display: inline-block;
      height: 26px;
      padding: 1px;
      line-height: 26px;
      min-width: 20%;
      max-width: 25%;
      background: #5dcdef;
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
      flex: auto;
    }
    .can-sale {
      background-color: #e0e0e0;
    }
  }
}
.draw-content {
  .col-6,
  .col-4,
  .col-8 {
    padding: 0;
  }
  .col-5 {
    margin-left: 6%;
    padding: 0 12px;
  }
  .detail-name {
    display: inline-block;
    width: 100px;
    height: 30px;
    background: #ccc;
    line-height: 30px;
  }
  .item-color {
    color: #000;
  }
  .theme--light.v-label--is-disabled {
    color: #101010;
  }
  .theme--light.v-input--is-disabled input {
    color: #1f8cff !important;
  }
}
</style>
