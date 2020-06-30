<template>
  <v-container>
    <v-row class="content">
      <v-row class="house-header d-flex justify-start">
        <div height="30" style="width:200px;">
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
        <div
          style="margin-left: 3%;width:200px;"
          v-if="buildingList.length > 0"
        >
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
      <v-row class="mode d-flex justify-start align-center">
        <span class="house can-sale"></span>&nbsp;&nbsp; 可售房源
        <span class="house xiaokong"></span>&nbsp;&nbsp; 销控房源
        <span class="house qianyue"></span>&nbsp;&nbsp; 签约房源
      </v-row>
      <!-- 销控—黄色   签约--蓝色   全款--打勾 -->
      <v-row class="item-detail">
        <v-row
          v-for="(item, index) in currentList"
          :key="index"
          class="item d-flex flex-wrap"
          style="width: 100%;"
        >
          <v-col :cols="item && item[0].is_car ? '12' : '1'" class="left">
            {{ index }}层
          </v-col>
          <v-col
            :cols="item && item[0].is_car ? '12' : '11'"
            class="right d-flex justify-start  text-center flex-wrap"
          >
            <div
              v-for="(m, i) in item"
              :key="i"
              :class="[
                m.status == 0
                  ? 'can-sale'
                  : m.status == 1
                  ? 'xiaokong'
                  : m.status == 2
                  ? 'qianyue'
                  : 'qianyue',
              ]"
              @click="goBuildingDetail(m)"
            >
              {{ m.room_num }} <span style="color: red;">{{m.car_num ? '|' : ''}}</span> {{ m.car_num}}
              <span v-if="m.status == 3" class="arelady-pay">ν</span>
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

    <v-dialog v-model="dialog" width="500">
      <v-card class="draw-content">
        <v-toolbar dark color="#90CAF9">
          <v-spacer class="text-center">房源信息更改</v-spacer>
        </v-toolbar>
        <v-row class="d-flex justify-start item-color">
          <v-col cols="12" class="d-flex justify-start  flex-wrap">
            <!-- 楼盘 -->
            <v-col cols="5">
              <v-select
                v-model="changeProperty_active"
                :hint="
                  `${changeProperty_active.name}, ${changeProperty_active.id}`
                "
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
            </v-col>
            <!-- 楼栋 -->
            <!-- v-if="!!changeBuildingList" -->
            <v-col cols="5">
              <v-select
                v-model="changeBuilding_active"
                :hint="
                  `${changeBuilding_active.name}, ${changeBuilding_active.id}`
                "
                :items="changeBuildingList"
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
            </v-col>
            <v-col cols="5" class="mt-6">
              <v-select
                v-model="currentStatus"
                :items="allStatus"
                item-value="id"
                item-text="name"
                label="状态"
                hide-details="true"
                outlined
                dense
                return-object
              >
              </v-select>
            </v-col>
            <v-col cols="5" class="mt-6">
              <v-select
                v-model="is_full_money_active"
                :items="ifFullMoney"
                item-value="id"
                item-text="name"
                label="是否全款"
                hide-details="true"
                outlined
                dense
                return-object
              >
              </v-select>
            </v-col>
            <v-col cols="5" class="mt-3">
              <v-text-field
                :label="currentItemDetail.is_car ? '车位号' : '房号'"
                v-model="currentItemDetail.room_num"
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="mt-3" v-if="currentItemDetail.car_num">
              <v-text-field
                label="子车位号"
                v-model="currentItemDetail.car_num"
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="mt-3" v-if="!currentItemDetail.is_car">
              <v-text-field
                label="户型"
                v-model="currentItemDetail.unit_type"
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="mt-3" v-if="currentItemDetail.is_car">
              <v-select
                v-model="zimu_active"
                :items="zimu"
                label="类型"
              ></v-select>
              <!-- <v-text-field
                label="类型"
                :value="`${currentItemDetail.set_type == 1 ? '标准' : '子母'}`"
              ></v-text-field> -->
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="楼层"
                v-model="currentItemDetail.floor"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="预测绘面积"
                v-model="currentItemDetail.area"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="单价"
                v-model="currentItemDetail.unit_price"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="总价"
                v-model="currentItemDetail.price"
              ></v-text-field>
            </v-col>

            <v-col cols="5">
              <v-text-field
                label="姓名"
                v-model="currentItemDetail.name"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="电话"
                v-model="currentItemDetail.phone"
              ></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field
                label="备注"
                v-model="currentItemDetail.memo"
              ></v-text-field>
            </v-col>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false"
            >取消</v-btn
          >
          <v-btn color="green darken-1" text @click="sureChange()"
            >确认更改</v-btn
          >
        </v-card-actions>
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
      changeBuildingList: [],
      currentList: [],
      currentItemDetail: {},
      currentItemDetailSave: {},
      changeProperty_active: {},
      changeBuilding_active: {},
      zimu_active: "",
      zimu: ["标准", "子母"],
      currentStatus: "",
      // 可售，销控，签约和全款
      allStatus: ["可售房源", "销控房源", "签约房源", "已回款"],
      dialog: false,
      sound: true,
      widgets: false,
      is_full_money_active: "",
      ifFullMoney: ["是", "否"],
    };
  },
  watch: {
    building_active(val) {
      if (val && val.id) {
        this.getItemList();
        this.changeBuilding_active = Object.assign({}, val);
      } else {
        this.currentList = [];
      }
    },
    property_active() {
      this.getBuilding();
    },
    changeProperty_active() {
      this.getBuildingFix();
    },
  },
  created() {
    this.getProperty();
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  computed: {
    currentRoomNum(val) {

     return  val.room_num 
    }
  },
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
          this.changeProperty_active = Object.assign({}, this.property_active);
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
    getBuildingFix() {
      axios
        .get(`${api.getBuilding}?community=${this.changeProperty_active.id}`)
        .then((res) => {
          this.changeBuildingList = res.data.data;
          this.changeBuilding_active = res.data.data[0];
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
      axios.get(`${api.getItemList}${val.id}/`).then((res) => {
        if (res.data.code == 4010) {
          this.text = "身份信息已失效，请重新登录";
          this.snackbar = true;
          this.snackbarColor = "red";
          this.$router.push("/login");
        } else if (res.data.code == 2000) {
          // this.changeProperty_active = Object.assign({}, this.property_active);
          this.changeBuilding_active = JSON.parse(
            JSON.stringify(this.building_active)
          );
          this.changeBuildingList = JSON.parse(
            JSON.stringify(this.buildingList)
          );
          this.currentItemDetailSave = res.data.data;
          this.currentItemDetail = Object.assign(
            {},
            this.currentItemDetailSave
          );
          console.log(this.currentItemDetail.set_type);
          this.zimu_active =
            this.currentItemDetail.set_type == 1 ? "标准" : "子母";
          this.is_full_money_active = this.currentItemDetail.is_full_money
            ? "是"
            : "否";
          this.currentStatus =
            this.currentItemDetail.status == 0
              ? "可售房源"
              : this.currentItemDetail.status == 1
              ? "销控房源"
              : this.currentItemDetail.status == 2
              ? "签约房源"
              : "已回款";
          this.dialog = true;
        }
      });
    },
    sureChange() {
      if (!this.changeBuilding_active) {
        this.text = "请选择楼栋";
        this.snackbar = true;
        this.snackbarColor = "red";
        return;
      }
      let fullMoney = this.is_full_money_active == "是" ? true : false;
      let houseStatus =
        this.currentStatus == "可售房源"
          ? 0
          : this.currentStatus == "销控房源"
          ? 1
          : this.currentStatus == "签约房源"
          ? 2
          : 3;
      let zimuActive = this.zimu_active == "标准" ? 1 : 0;
      this.zimu_active = this.currentItemDetail.set_type == 1 ? "标准" : "子母";
      let body = {
        area: this.currentItemDetail.area,
        car_num: this.currentItemDetail.car_num,
        build_num: this.changeBuilding_active.id,
        is_full_money: fullMoney,
        floor: this.currentItemDetail.floor,
        memo: this.currentItemDetail.memo,
        name: this.currentItemDetail.name,
        phone: this.currentItemDetail.phone,
        price: this.currentItemDetail.price,
        room_num: this.currentItemDetail.room_num,
        set_type: zimuActive,
        unit_price: this.currentItemDetail.unit_price,
        unit_type: this.currentItemDetail.unit_type,
        status: houseStatus,
      };
      console.log(body);
      axios
        .put(`${api.getItemList}${this.currentItemDetailSave.id}/`, body)
        .then((res) => {
          if (res.data.code === 2000) {
            this.text = "修改信息成功";
            this.snackbar = true;
            this.snackbarColor = "success";
            this.getItemList();
            this.dialog = false;
          }
        });
    },
  },
};
</script>
<style scoped lang="scss">
.container {
  padding: 0;
  margin-bottom: 10px;
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
    width: 100%;
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
      cursor: pointer;
      width: 10%;
      max-width: 10%;
      position: relative;
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
      flex: auto;
    }
    .can-sale {
      background-color: #e0e0e0;
    }
    .xiaokong {
      background: yellow;
    }
    .qianyue {
      background: #5dcdef;
    }
    .arelady-pay {
      position: absolute;
      right: 0;
      display: block;
      top: 0;
      background: #c33030;
      width: 12px;
      height: 12px;
      font-size: 12px;
      line-height: 12px;
      color: white;
    }
    .more-5 {
      width: 10%;
      max-width: 10%;
    }
  }
}
.draw-content {
  .col-6,
  .col-4,
  .col-8， .col-10 {
    padding: 0;
  }
  .col-5 {
    margin-left: 6%;
    padding: 0 12px;
  }
  .col-10 {
    margin-left: 6%;
    padding: 0 12px;
  }
  .theme--dark.v-sheet {
    color: #000;
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
.mode {
  height: 50px;
  line-height: 50px;
}
.house {
  display: inline-block;
  margin-left: 20px;
  width: 16px;
  height: 16px;
  line-height: 30px;
}
.can-sale {
  background-color: #e0e0e0;
}
.xiaokong {
  background: yellow;
}
.qianyue {
  background: #5dcdef;
}
</style>
