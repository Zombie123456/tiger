<template>
  <v-container>
    <v-row class="house-header">
      <div style="width:200px;" class="mr-2">
        <v-select
          v-model="is_active"
          :hint="`${is_active.name}, ${is_active.id}`"
          :items="buildingList"
          item-value="id"
          item-text="name"
          label="楼盘选择"
          hide-details="true"
          outlined
          dense
          return-object
          persistent-hint
        >
        </v-select>
      </div>
    </v-row>
    <v-row>
      <v-col cols="12" class="house-title d-flex  justify-center text-center">
        <v-col cols="1" style="font-size: 20px;">
          楼层
        </v-col>
        <v-col cols="11">
          <span style="font-size: 20px;"> 房源信息</span>
          <span class="demo-color can-sale"></span> 可售房源
          <span class="demo-color kongxiao"></span> 销控房源
          <span class="demo-color qianyue"></span> 签约房源
          <span class="demo-color quankuan"></span> 全款到账
        </v-col>
      </v-col>
      <v-col
        cols="12"
        class="house-item  d-flex  justify-center text-center"
        v-for="(item, index) in allHouseList"
        :key="index"
      >
        <v-col cols="1" class="d-flex align-self-center  justify-center ">
          第{{ index }}层
        </v-col>
        <v-col cols="11" class="d-flex  justify-start text-left flex-wrap">
          <div class="item" v-for="(m, i) in item" :key="i">
            <!-- houseAllStatus: ["可售房源", "销控房源", "签约房源", "全款到账"], -->
            <v-card
              @click="changeStatus(m)"
              :class="
                m.status === 0
                  ? 'can-sale'
                  : m.status === 1
                  ? 'kongxiao'
                  : m.status === 2
                  ? 'qianyue'
                  : m.status === 3
                  ? 'quankuan'
                  : ''
              "
            >
              <v-col
                cols="12"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="6">
                  户号: <span class="red--text">{{ m.room_num }}</span>
                </v-col>
                <v-col cols="6">户型:{{ m.unit_type }}</v-col>
              </v-col>
              <v-col
                cols="12"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="6">面积:{{ m.area }} m<sup>2</sup></v-col>
                <v-col cols="6">
                  全款:
                  <span :class="m.is_full_money ? 'red--text' : ''">{{
                    m.is_full_money ? "是" : "否"
                  }}</span>
                </v-col>
              </v-col>
              <v-col
                cols="12"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="6">
                  单价:{{ parseFloat(m.unit_price).toFixed(2) }}元
                </v-col>
                <v-col cols="6">
                  状态:{{
                    m.status === 0
                      ? "可售房源"
                      : m.status === 1
                      ? "销控房源"
                      : m.status === 2
                      ? "签约房源"
                      : m.status === 3
                      ? "全款到账"
                      : "没有状态"
                  }}
                </v-col>
              </v-col>
              <v-col
                cols="12"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="6">
                  总价:{{ parseFloat(m.price).toFixed(2) }}元
                </v-col>
                <v-col cols="6" v-if="m.phone"> 电话:{{ m.phone }} </v-col>
              </v-col>
              <v-col
                cols="12"
                v-if="m.memo"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="12">
                  备注:
                  <span class="red--text">{{ m.memo }} </span></v-col
                >
              </v-col>
            </v-card>
          </div>
        </v-col>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          房源信息更改<span>(不用填写单位)</span>
        </v-card-title>
        <v-row style="width:500px;">
          <!-- 户号，户型，面积，单价，总价，状态，楼盘，楼层，是否全款 -->
          <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
            class="form-content"
          >
            <v-col cols="12" class="d-flex  justify-center text-left flex-wrap">
              <v-col cols="6">
                <v-select
                  v-model="is_activeClone"
                  :items="buildingClone"
                  :rules="[(v) => !!v || 'Item is required']"
                  label="楼盘"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.room_num"
                  :rules="nameRules"
                  label="户号"
                  required
                ></v-text-field>
              </v-col>
            </v-col>

            <v-col cols="12" class="d-flex  justify-center text-left flex-wrap">
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.unit_type"
                  :rules="nameRules"
                  label="户型"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.floor"
                  :rules="nameRules"
                  label="楼层"
                  required
                ></v-text-field>
              </v-col>
            </v-col>
            <v-col cols="12" class="d-flex  justify-center text-left flex-wrap">
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.area"
                  :rules="nameRules"
                  label="面积"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.unit_price"
                  :rules="nameRules"
                  label="单价"
                  required
                ></v-text-field>
              </v-col>
            </v-col>

            <v-col cols="12" class="d-flex  justify-center text-left flex-wrap">
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.price"
                  :rules="nameRules"
                  label="总价"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <!-- modifyDetail.is_full_money -->
                <v-select
                  v-model="ifFullMoney"
                  :items="items"
                  :rules="[(v) => !!v || '请选择']"
                  label="是否全款"
                  required
                ></v-select>
              </v-col>
            </v-col>
            <v-col cols="12" class="d-flex  justify-left text-left flex-wrap">
              <v-col cols="6">
                <!-- modifyDetail.is_full_money -->
                <v-select
                  v-model="houseStatus"
                  :items="houseAllStatus"
                  :rules="[(v) => !!v || '请选择']"
                  label="状态"
                  required
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.phone"
                  label="电话"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="modifyDetail.memo"
                  label="备注"
                  required
                ></v-text-field>
              </v-col>
            </v-col>
          </v-form>
        </v-row>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" text @click="reset">
            重置
          </v-btn> -->
          <v-btn color="primary" text @click="dialog = false">
            取消更改
          </v-btn>
          <v-btn color="primary" text @click="changeHouseStatus()">
            确认更改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="2000"
      :top="true"
    >
      {{ text }}
    </v-snackbar>
  </v-container>
</template>
<script>
import api from "@/api/apis";
import { mapState } from "vuex";
import $ from "../../utils/util";
import axios from "axios";
import VueCookie from "vue-cookie";

export default {
  components: {},
  data() {
    return {
      text: "",
      snackbarColor: "",
      snackbar: false,
      allHouseList: "",
      buildingList: [],
      buildingClone: [],
      houseDetail: {},
      modifyDetail: {},
      dialog: false,
      is_active: {},
      is_activeClone: {},
      ifFullMoney: "",
      valid: true,
      name: "",
      nameRules: [(v) => !!v || "必填"],
      email: "",
      select: null,
      items: ["是", "否"],
      houseStatus: [],
      houseAllStatus: ["可售房源", "销控房源", "签约房源", "全款到账"],
      checkbox: false,
      lazy: false,
    };
  },
  watch: {
    is_active(val) {
      this.getHouse(val.id);
    },
  },
  created() {
    this.getBuilding();
    // this.getHouse();
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  computed: {
    getReport() {
      // this.$refs.pulling.getExportQuery()
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.href = `${this.exportApi}?token=${VueCookie.get(
        "access_token"
      )}&website=${this.query.website}`;
      return this.querySet.length;
    },
    ...mapState({
      role: (state) => state.role,
    }),
  },
  methods: {
    getBuilding() {
      axios.get(`${api.building}`).then((res) => {
        this.buildingList = res.data;
        // this.buildingClone = Object.assign({}, this.buildingList);
        this.buildingList.forEach((i) => {
          this.buildingClone.push(i.name);
        });
        this.is_active = this.buildingList[0];
        this.getHouse(res.data[0].id);
      });
    },
    getHouse(id) {
      //  `${api.house}?limit=${this.limit}&offset=${this.offset}`
      axios.get(`${api.house}?build_num=${id}`).then((res) => {
        if (res.data.code === 2000) {
          this.allHouseList = res.data.data;
        } else if (res.data.code === 4010) {
          this.$router.push("/login");
        }
      });
    },
    changeStatus(val) {
      this.houseDetail = val;
      this.is_activeClone = this.is_active.name;
      this.modifyDetail = Object.assign({}, this.houseDetail);
      this.ifFullMoney = this.modifyDetail.is_full_money ? "是" : "否";
      // : ["可售房源", "销控房源", "签约房源", "全款到账"],
      this.houseStatus =
        this.modifyDetail.status === 0
          ? "可售房源"
          : this.modifyDetail.status === 1
          ? "销控房源"
          : this.modifyDetail.status === 2
          ? "签约房源"
          : this.modifyDetail.status === 3
          ? "全款到账"
          : "没有状态";
      this.dialog = true;
    },
    reset() {
      this.$refs.form.reset();
    },
    validate() {
      this.$refs.form.validate();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    changeHouseStatus() {
      let flag = this.$refs.form.validate();
      if (!flag) {
        return;
      }
      let propertyId;
      let houseId = this.modifyDetail.id;
      this.buildingList.forEach((i) => {
        if (this.is_activeClone === i.name) {
          propertyId = i.id;
        }
      });
      let ifFullMoney = this.ifFullMoney === "是" ? true : false;
      let houseStatus = this.houseAllStatus.indexOf(this.houseStatus);
      let body = {
        area: this.modifyDetail.area,
        build_num_id: propertyId,
        floor: this.modifyDetail.floor,
        is_full_money: ifFullMoney,
        phone: this.modifyDetail.phone,
        memo: this.modifyDetail.memo,
        price: this.modifyDetail.price,
        room_num: this.modifyDetail.room_num,
        status: houseStatus,
        unit_price: this.modifyDetail.unit_price,
        unit_type: this.modifyDetail.unit_type,
      };
      axios
        .put(`${api.house}${houseId}/`, body)
        .then((res) => {
          if (res.data.code === 2000) {
            this.getBuilding();
            this.dialog = false;
            this.snackbarColor = "success";
            this.text = "更改数据成功";
            this.snackbar = true;
          } else {
            this.snackbarColor = "warning";
            this.text = res.data.msg;
            this.snackbar = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async uploadFile(mode) {
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        if (mode == "upload") {
          this.uploadLoading = true;
          const formData = new window.FormData();
          formData.set("app_file", this.file);
          formData.set("website", this.setWebsite);
          await axios
            .post(api.upload, formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: function(progressEvent) {
                this.uploadPercentage = parseInt(
                  Math.round((progressEvent.loaded / progressEvent.total) * 100)
                );
              }.bind(this),
            })
            .then(() => {
              this.$refs.pulling.rebase();
              this.close();
              //   this.snackbarColor = 'success'
              //    this.text = res.data.msg;
              // this.snackbar = true;
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.upload")}: ${this.$t(
                  "status.success"
                )}`,
              };
            })
            .catch(function(err) {
              console.log(err);
            });
        }
      }
    },
  },
};
</script>
<style scope lang="scss">
.v-date-picker-title__date {
  font-size: 20px !important;
}
.house-header {
  padding: 10px;
}
.house-title {
  border-bottom: 1px solid #ccc;
  .demo-color {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 10px;
  }
  .can-sale {
    background-color: #99ff98;
  }
  .kongxiao {
    background-color: #accfea;
  }
  .qianyue {
    background-color: #bdbdbd;
  }
  .quankuan {
    background: #ffbc00;
  }
}
.house-item {
  font-size: 12px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  .col-12 {
    padding: 0px 4px 4px 4px;
  }
  .col-6 {
    padding: 2px 2px;
  }
}
.item {
  width: 24%;
  margin: 1% 1% 0 0;
  max-width: 280px;
  .can-sale {
    background-color: #99ff98;
  }
  .kongxiao {
    background-color: #accfea;
  }
  .qianyue {
    background-color: #bdbdbd;
  }
  .quankuan {
    background: #ffbc00;
  }
}
.form-content {
  .col-12 {
    padding: 10px 12px 0 12px;
  }
}
</style>
