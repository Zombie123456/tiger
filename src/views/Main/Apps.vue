<template>
  <v-container>
    <v-row>
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
      <v-col cols="12 d-flex  justify-center text-center">
        <v-col cols="1">
          楼层
        </v-col>
        <v-col cols="11">房源信息</v-col>
      </v-col>
      <v-col
        cols="12 d-flex  justify-center text-center"
        v-for="(item, index) in allHouseList"
        :key="index"
      >
        <v-col cols="1"> 第{{ index }}层 </v-col>
        <v-col cols="11" class="d-flex  justify-start text-left flex-wrap">
          <div class="item" v-for="(m, i) in item" :key="i">
            <v-card @click="changeStatus(m)">
              <v-card-text>
                <!-- <div
                  cols="12"
                  class="d-flex  justify-start text-left flex-wrap"
                >
                  <span cols="6">户号:{{ m.room_num }}</span>
                  <span cols="6">户型:{{ m.unit_type }}</span>
                  <v-col></v-col>
                </div> -->
                <p>户号:{{ m.room_num }}</p>
                <p>户型:{{ m.unit_type }}</p>
                <p>面积:{{ m.area }} m<sup>3</sup></p>
                <p>单价:{{ m.unit_price }}元</p>
                <p>总价:{{ m.price }}</p>
                <p>
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
                </p>
                <p>总价:{{ m.price }}</p>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          房源信息更改
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            取消更改
          </v-btn>
          <v-btn color="primary" text @click="dialog = false">
            确认更改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import api from "@/api/apis";
import $ from "../../utils/util";
// import Pagination from '@/components/Pagination'
// import SnackBar from '@/components/SnackBar'
// import { debounce } from 'lodash'
// import { ValidationObserver, ValidationProvider } from 'vee-validate'
// import Website from '../../components/SelectWebsite.vue'
import axios from "axios";
import VueCookie from "vue-cookie";

export default {
  // name: "Apps",
  components: {
    // Pagination,
    // SnackBar,
    // ValidationObserver,
    // ValidationProvider,
    // Website
  },
  data() {
    return {
      allHouseList: "",
      buildingList: [],
      dialog: false,
      is_active: { name: "楼盘选择", id: 1, code: "楼盘选择" },
    };
  },
  watch: {
    // $route: {
    //   handler() {
    //     this.loading = true;
    //     this.setQueryAll();
    //     this.$refs.pulling.rebase();
    //   },
    //   deep: true,
    // }
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
  },
  methods: {
    getBuilding() {
      axios.get(`${api.building}`).then((res) => {
        console.log(res);
        console.log(res.data);
        console.log(res.data[0]);
        this.buildingList = res.data;
        this.is_active = this.buildingList[0];
        this.getHouse(res.data[0].id);
      });
    },
    getHouse(id) {
      console.log(api);
      console.log(api.house);
      //  `${api.house}?limit=${this.limit}&offset=${this.offset}`
      axios.get(`${api.house}?build_num=${id}`).then((res) => {
        console.log(res.data);
        if (res.data.code === 2000) {
          this.allHouseList = res.data.data;
        }
      });
    },
    changeStatus(val) {
      console.log(val);
      this.dialog = true;
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
.item {
  width: 200px;
  margin: 1% 1% 0 0;
}
</style>
