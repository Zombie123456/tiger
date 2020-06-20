<template>
  <v-container>
    <v-row class="house-header">
      <div style="width:100px;" class="mr-2">
        <v-select
          v-model="is_active"
          :hint="`${is_active.name}, ${is_active.id}`"
          :items="buildingList"
          item-value="id"
          item-text="name"
          label="楼层选择"
          hide-details="true"
          outlined
          dense
          return-object
          persistent-hint
        >
        </v-select>
      </div>
      <!-- <div style="width:200px;" class="mr-2">
        <v-select
          v-model="pageCarStatus"
          :hint="`${is_active.name}, ${is_active.id}`"
          :items="carAllStatus"
          item-value="id"
          item-text="name"
          label="车位状态"
          hide-details="true"
          outlined
          dense
          return-object
          persistent-hint
        >
        </v-select>
      </div> -->
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="house-item d-flex  justify-center text-center flex-wrap"
      >
        <v-col cols="12" class="d-flex  justify-start text-left flex-wrap">
          <div class="item" v-for="(m, i) in allHouseList" :key="i">
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
                  楼层: <span class="red--text">{{ m.floor }}楼</span>
                </v-col>
                <v-col cols="6"
                  >车位号:
                  <span class="red--text"> {{ m.set_num }}</span></v-col
                >
              </v-col>
              <v-col
                cols="12"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="6">
                  类型:{{ m.set_type == 1 ? "标准" : "子母" }}
                </v-col>
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
                  总价:{{ parseFloat(m.price).toFixed(2) }}元
                </v-col>
                <v-col cols="6">
                  状态:{{
                    m.status === 0
                      ? "可售车位"
                      : m.status === 1
                      ? "销控车位"
                      : m.status === 2
                      ? "签约车位"
                      : m.status === 3
                      ? "全款到账"
                      : "没有状态"
                  }}
                </v-col>
              </v-col>
              <!-- <v-col
                cols="12"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="6" v-if="m.name"> 姓名:{{ m.name }} </v-col>
                <v-col cols="6" v-if="m.phone"> 电话:{{ m.phone }} </v-col>
              </v-col> -->
              <!-- <v-col
                cols="12"
                v-if="m.memo"
                class="d-flex  justify-start text-left flex-wrap"
              >
                <v-col cols="12">
                  备注:
                  <span class="red--text">{{ m.memo }} </span></v-col
                >
              </v-col> -->
            </v-card>
          </div>
        </v-col>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-col v-if="totalPage > 1" class="pagination">
        <v-pagination
          v-model="currentPage"
          :length="totalPage"
          color="#FF9A00"
        ></v-pagination>
      </v-col>
    </div>
    <v-dialog v-model="dialog">
      <v-card class="card-cn">
        <v-card-title class="headline grey lighten-2" primary-title>
          车位信息更改
        </v-card-title>
        <v-row class="form-box">
          <!-- 户号，户型，面积，单价，总价，状态，楼盘，楼层，是否全款 -->
          <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
            class="form-content"
          >
            <v-col cols="12" class="d-flex  justify-center text-left flex-wrap">
              <v-col cols="6">
                <v-text-field
                  v-model="is_activeClone"
                  label="车位楼层"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.set_num"
                  label="车位号"
                  disabled
                ></v-text-field>
              </v-col>
            </v-col>
            <v-col cols="12" class="d-flex  justify-center text-left flex-wrap">
              <v-col cols="6">
                <v-text-field
                  v-model="modifyDetail.price"
                  label="总价"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="ifMother"
                  label="车位类型"
                  disabled
                ></v-text-field>
                <!-- modifyDetail.is_full_money -->
              </v-col>
            </v-col>
            <v-col cols="12" class="d-flex  justify-left text-left flex-wrap">
              <v-col cols="6">
                <v-switch
                  v-model="houseStatus"
                  class="ma-2"
                  label="销控"
                ></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="modifyDetail.is_full_money"
                  class="ma-2"
                  label="全款"
                ></v-switch>
              </v-col>
            </v-col>
            <v-col cols="12" class="d-flex  justify-left text-left flex-wrap">
              <v-col cols="12">
                <v-text-field
                  v-model="modifyDetail.name"
                  label="姓名"
                ></v-text-field>
              </v-col>
            </v-col>
            <v-col cols="12" class="d-flex  justify-left text-left flex-wrap">
              <v-col cols="12">
                <v-text-field
                  v-model="modifyDetail.phone"
                  label="电话"
                ></v-text-field>
              </v-col>
            </v-col>
          </v-form>
        </v-row>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
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

export default {
  components: {},
  data() {
    return {
      text: "",
      currentPage: 1,
      count: 1000,
      pageLimit: 52,
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
      ifMother: "",
      valid: true,
      name: "",
      nameRules: [(v) => !!v || "必填"],
      email: "",
      select: null,
      items: ["是", "否"],
      houseStatus: false,
      currentCarStatus: null,
      pageCarStatus: ["全部"],
      sonMother: ["标准", "子母"],
      houseAllStatus: ["可售车位", "销控车位", "签约车位", "全款到账"],
      carAllStatus: ["全部", "可售车位", "销控车位", "签约车位", "全款到账"],
      checkbox: false,
      lazy: false,
    };
  },
  watch: {
    is_active() {
      this.getHouse();
    },
    currentPage() {
      this.getHouse();
    },
  },
  created() {
    this.getBuilding();
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
    }),
    totalPage() {
      return Math.ceil(this.count / this.pageLimit);
    },
  },
  methods: {
    getBuilding() {
      axios.get(`${api.carFilter}`).then((res) => {
        this.buildingList = res.data.data;
        this.buildingClone = Object.assign({}, this.buildingList);
        this.is_active = this.buildingList[0];
      });
    },
    getHouse() {
      let offset = (this.currentPage - 1) * this.pageLimit;
      //  `${api.house}?limit=${this.limit}&offset=${this.offset}`
      let url;
      if (this.currentCarStatus === null) {
        url = "";
      } else {
        url = `&status=${this.currentCarStatus}`;
      }
      axios
        .get(
          `${api.car}?floor=${this.is_active}&limit=${this.pageLimit}&offset=${offset}${url}`
        )
        .then((res) => {
          if (res.data.code === 2000) {
            this.allHouseList = res.data.data.results;
            this.count = res.data.data.count;
          } else if (res.data.code === 4010) {
            this.$router.push("/login");
          }
        });
    },
    changeStatus(val) {
      this.houseDetail = val;
      this.is_activeClone = val.floor;
      this.modifyDetail = Object.assign({}, this.houseDetail);

      this.ifFullMoney = this.modifyDetail.is_full_money ? "是" : "否";
      this.ifMother = this.modifyDetail.set_type == 1 ? "标准" : "子母";
      // : ["可售房源", "销控房源", "签约房源", "全款到账"],
      this.houseStatus = this.modifyDetail.status === 0 ? false : true;
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
      let houseId = this.modifyDetail.id;
      let houseStatus = this.houseStatus ? 1 : 0;
      this.ifMother = this.modifyDetail.set_type == 1 ? "标准" : "子母";
      let body = {
        is_full_money: this.modifyDetail.is_full_money,
        phone: this.modifyDetail.phone,
        name: this.modifyDetail.name,
        status: houseStatus,
      };
      axios
        .put(`${api.car}${houseId}/`, body)
        .then((res) => {
          if (res.data.code === 2000) {
            this.getHouse();
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
  },
};
</script>
<style scope lang="scss">
.container {
  padding: 0;
}
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
  border-top: 1px solid #ccc;
  font-size: 12px;
  .col-12 {
    padding: 0px 4px 4px 4px;
  }
  .col-6 {
    padding: 2px 2px;
  }
}
.form-box {
  width: 90%;
  margin: 0 auto;
}
.item {
  width: 100%;
  margin: 1%;
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
.card-cn {
  .col-12 {
    padding: 4px 10px 0 10px;
  }
  .col-6,
  .col-8,
  .col-4 {
    padding: 0 4px 0 0;
  }
}
</style>
