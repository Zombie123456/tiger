<template>
  <v-container>
    <!-- 楼盘 -->
    <v-row class="creat1">
      <v-col cols="12" class="d-flex justify-start creat1-item flex-wrap">
        <v-col cols="12">
          导入规则：(此页面只有管理员能操作)
        </v-col>
        <v-col cols="12">
          1.如果要新增楼盘，填入楼盘名，点击创建楼盘（下面第一个创建）
        </v-col>
        <v-col cols="12">
          2.如果要新增楼栋<span class="red"
            >(包括车位，如果有车位有两层，分别创建车位-1层，车位-2层)</span
          >，首先选择一个已有楼盘，如果没有该楼盘，首先创建一个楼盘，然后再创建楼栋（下面第二个创建，选择楼盘，填入楼栋名(车位名)，点击创建）
        </v-col>
        <v-col cols="12">
          3.上传房源，选择楼盘和楼栋，然后点击确认上传（下面第三个创建左边按钮）
        </v-col>
        <v-col cols="12">
          4.上传车位，选择楼盘和楼栋（车位一层，车位二层），然后点击确认上传（下面第三个创建右边按钮）<span
            class="red"
            >车位每一层单独上传</span
          >
        </v-col>
        <v-col cols="12">
          5.如果文件上传错误，可以删除，文件中的房源或车位同时会被删除
        </v-col>
      </v-col>
      <v-col cols="12" class="d-flex justify-start creat1-item">
        <v-col cols="4">
          <v-text-field
            label="输入创建的楼盘名"
            v-model="loupan"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="my-2">
            <v-btn large color="primary" @click="creatLouPan()">创建楼盘</v-btn>
          </div>
        </v-col>
      </v-col>
    </v-row>
    <!-- 楼栋 -->
    <v-row>
      <v-col class="d-flex justify-start ">
        <v-col cols="4">
          <v-select
            v-model="creatLouDong_active"
            :hint="`${creatLouDong_active.name}, ${creatLouDong_active.id}`"
            :items="propertyList"
            item-value="id"
            item-text="name"
            label="楼盘"
            hide-details="true"
            outlined
            return-object
            persistent-hint
          >
          </v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="输入创建的楼栋名或车位楼层名"
            v-model="loudong"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="my-2">
            <v-btn large color="primary" @click="creatLouDong">创建楼栋</v-btn>
          </div>
        </v-col>
      </v-col>
      <div></div>
    </v-row>
    <!-- 上传 -->
    <v-row>
      <v-col cols="2" @click="(dialog = true), (currentUpload = 'house')">
        <v-btn class="ma-2" color="indigo" dark large>
          <v-icon dark>mdi-cloud-upload</v-icon>
          <span> 房源上传</span>
        </v-btn>
      </v-col>
      <v-col cols="2" @click="(dialog = true), (currentUpload = 'car')">
        <v-btn class="ma-2" color="indigo" dark large>
          <v-icon dark>mdi-cloud-upload</v-icon>
          <span>车位上传(一次传入一层楼车位)</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:body="{ items }">
            <span v-if="!items">{{ items }}</span>
            <tbody>
              <tr v-for="item in desserts" :key="item.id">
                <td>{{ item.file_name }}</td>
                <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                <td class="align-center justify-center px-0">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        style="margin-left:22px;"
                        color="red"
                        small
                        v-on="on"
                        >delete</v-icon
                      >
                    </template>
                    <v-list dark>
                      <v-list-item @click="deleteStaff(item)">
                        <v-list-item-title>
                          <v-icon class="mr-2" color="orange">warning</v-icon>
                          点击此处删除
                          <strong>{{ item.file_name }}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card class="draw-content">
        <v-toolbar dark color="#90CAF9">
          <v-spacer class="text-center">上传房源数据</v-spacer>
        </v-toolbar>
        <v-row>
          <v-row class="house-header d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start ">
              <v-select
                v-model="upload_loupan_active"
                :hint="`${upload_loupan_active}, ${upload_loupan_active.id}`"
                :items="propertyList"
                item-value="id"
                item-text="name"
                label="楼盘"
                hide-details="true"
                outlined
                return-object
                persistent-hint
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="upload_loudong_active"
                :hint="
                  `${upload_loudong_active.name}, ${upload_loudong_active.id}`
                "
                :items="buildingList"
                item-value="id"
                item-text="name"
                label="楼栋"
                hide-details="true"
                outlined
                return-object
                persistent-hint
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-file-input
                label="上传房源文件"
                outlined
                dense
                v-model="importFile"
              ></v-file-input>
            </v-col>
            <v-col cols="12">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">
                  取消
                </v-btn>
                <v-btn color="green darken-1" text @click="importCsv">
                  确认上传
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-row>
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
// import $ from "../../utils/util";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      snackbar: false,
      snackbarColor: "",
      text: "",
      property_active: {},
      creatLouDong_active: {},
      upload_loupan_active: {},
      upload_loudong_active: {},
      propertyList: [],
      building_active: {},
      buildingList: [],
      loupan: "",
      loudong: "",
      dialog: false,
      importFile: null,
      currentUpload: "",
      headers: [
        {
          sortable: false,
          text: "文件名",
          value: "file_name",
        },
        {
          sortable: false,
          text: "上传时间",
          value: "created_at",
        },
        {
          sortable: false,
          text: "操作",
        },
      ],
      desserts: [],
    };
  },
  watch: {
    upload_loupan_active() {
      this.getBuilding();
    },
  },
  created() {
    this.getProperty();
    this.getImportLog();
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
    }),
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
          this.creatLouDong_active = Object.assign({}, this.property_active);
          this.upload_loupan_active = Object.assign({}, this.property_active);
          this.getBuilding();
        }
      });
    },
    getBuilding() {
      axios
        .get(`${api.getBuilding}?community=${this.upload_loupan_active.id}`)
        .then((res) => {
          this.buildingList = res.data.data;
          this.building_active = res.data.data[0];
          this.upload_loudong_active = Object.assign({}, this.building_active);
        });
    },
    creatLouPan() {
      if (!this.loupan) {
        this.text = "请输入要创建的楼盘名";
        this.snackbar = true;
        this.snackbarColor = "red";
        return;
      }
      let body = {
        name: this.loupan,
      };
      axios.post(`${api.getProperty}`, body).then((res) => {
        if (res.data.code === 2000) {
          this.text = "创建楼盘成功";
          this.snackbar = true;
          this.snackbarColor = "success";
          this.getProperty();
        } else {
          this.text = res.data.msg;
          this.snackbar = true;
          this.snackbarColor = "red";
        }
      });
    },
    creatLouDong() {
      if (!this.loudong || !this.creatLouDong_active) {
        this.text = "请选择楼盘或输入要创建的楼栋名";
        this.snackbar = true;
        this.snackbarColor = "red";
        return;
      }
      let body = {
        name: this.loudong,
        community: this.creatLouDong_active.id,
        code: this.loudong,
      };
      axios.post(`${api.getBuilding}`, body).then((res) => {
        console.log(res.data);
        if (res.data.code === 2000) {
          this.text = "创建楼栋成功";
          this.snackbar = true;
          this.snackbarColor = "success";
          this.getProperty();
        }
        this.loudong = "";
      });
    },
    importCsv() {
      console.log(!this.upload_loupan_active.id);
      console.log(!this.upload_loudong_active.id);
      console.log(!this.importFile);
      if (
        !this.upload_loupan_active.id ||
        !this.upload_loudong_active.id ||
        !this.importFile
      ) {
        this.text = "请选择必要的楼盘，楼栋和上传文件";
        this.snackbar = true;
        this.snackbarColor = "red";
        return;
      }
      const formData = new window.FormData();
      formData.set("import_file", this.importFile);
      formData.set("build_id", this.upload_loudong_active.id);
      let hostUrl;
      if (this.currentUpload === "house") {
        hostUrl = api.importFile;
      } else if (this.currentUpload === "car") {
        hostUrl = api.importCarFile;
      }
      axios.post(`${hostUrl}`, formData).then((res) => {
        console.log(res);
        if (res.data.code === 2000) {
          this.text = "导入数据成功";
          this.snackbar = true;
          this.snackbarColor = "success";
          this.getImportLog();
          this.dialog = false;
        } else {
          this.text = res.data.msg;
          this.snackbar = true;
          this.snackbarColor = "red";
        }
      });
    },
    getImportLog() {
      axios.get(`${api.getImportLog}`).then((res) => {
        console.log(res);
        this.desserts = res.data.data;
      });
    },
    deleteStaff(val) {
      console.log(val.id);
      axios.delete(`${api.getImportLog}${val.id}/`).then((res) => {
        console.log(res);
        console.log(res.data);
        this.text = "删除数据成功";
        this.snackbar = true;
        this.snackbarColor = "red";
        this.getImportLog();
      });
    },
  },
};
</script>
<style scope lang="scss">
// .v-select {
//   margin-top: 10px;
// }
</style>
