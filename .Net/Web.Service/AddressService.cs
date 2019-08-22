using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Users;
using Sabio.Models.Users;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class AddressService : IAddressService
    {
        private IDataProvider _dataProvider;

        public AddressService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public int Insert(AddressAddRequest model, int userId)
        {
            int id = 0;

            _dataProvider.ExecuteNonQuery("dbo.Addresses_Insert", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                SqlParameter parm = new SqlParameter();
                parm.ParameterName = "@Id";
                parm.SqlDbType = SqlDbType.Int;
                parm.Direction = ParameterDirection.Output;
                parms.Add(parm);

                parms.AddWithValue("@UserId", userId);
                parms.AddWithValue("@AddressTypeId", model.AddressTypeId);
                parms.AddWithValue("@LineOne", model.LineOne);
                parms.AddWithValue("@LineTwo", model.LineTwo);
                parms.AddWithValue("@City", model.City);
                parms.AddWithValue("@Zip", model.Zip);
                parms.AddWithValue("@StateId", model.StateId);
                parms.AddWithValue("@Latitude", model.Latitude);
                parms.AddWithValue("@Longitude", model.Longitude);

            }, returnParameters: delegate (SqlParameterCollection parms)
            {
                Int32.TryParse(parms["@Id"].Value.ToString(), out id);
            });
            return id;
        }

        public void Update(AddressUpdateRequest model)
        {
            _dataProvider.ExecuteNonQuery("Addresses_Update", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@Id", model.Id);
                parms.AddWithValue("@AddressTypeId", model.AddressTypeId);
                parms.AddWithValue("@LineOne", model.LineOne);
                parms.AddWithValue("@LineTwo", model.LineTwo);
                parms.AddWithValue("@City", model.City);
                parms.AddWithValue("@Zip", model.Zip);
                parms.AddWithValue("@StateId", model.StateId);
                parms.AddWithValue("@Latitude", model.Latitude);
                parms.AddWithValue("@Longitude", model.Longitude);
            });
        }

        public Address GetById(int id)
        {
            Address model = null;

            _dataProvider.ExecuteCmd("dbo.Addresses_SelectById", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                model = AddressMapper(reader);
            });
            return model;
        }

        public Address GetByResourceId(int id)
        {
            Address model = null;

            _dataProvider.ExecuteCmd("dbo.Addresses_SelectAddressByResourceId", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                model = AddressMapper(reader);
            });
            return model;
        }

        public Address GetByResourceUserId(int id)
        {
            Address model = null;

            _dataProvider.ExecuteCmd("dbo.Addresses_SelectAddressByResourceUserId", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@UserId", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                model = AddressMapper(reader);
            });
            return model;
        }

        public Address GetByBusinessUserId(int userId)
        {
            Address model = null;

            _dataProvider.ExecuteCmd("dbo.Addresses_SelectAddressByBusinessUserId", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@UserId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                model = AddressMapper(reader);
            });
            return model;
        }

        public Address GetByBusinessId(int id)
        {
            Address model = null;

            _dataProvider.ExecuteCmd("dbo.Addresses_SelectAddressByBusinessId", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                model = AddressMapper(reader);
            });
            return model;
        }

        private static Address AddressMapper(IDataReader reader)
        {
            Address model = new Address();
            int startingIndex = 0;

            model.Id = reader.GetSafeInt32(startingIndex++);
            model.AddressTypeId = reader.GetSafeInt32(startingIndex++);
            model.LineOne = reader.GetSafeString(startingIndex++);
            model.LineTwo = reader.GetSafeString(startingIndex++);
            model.City = reader.GetSafeString(startingIndex++);
            model.Zip = reader.GetSafeString(startingIndex++);
            model.StateId = reader.GetSafeInt32(startingIndex++);
            model.StateCode = reader.GetSafeString(startingIndex++);
            model.Latitude = reader.GetSafeDouble(startingIndex++);
            model.Longitude = reader.GetSafeDouble(startingIndex++);
            return model;
        }

        public void Delete(int id)
        {
            _dataProvider.ExecuteNonQuery("dbo.Addresses_Delete", inputParamMapper: delegate (SqlParameterCollection parms)
            {
                parms.AddWithValue("@Id", id);
            });
        }

        public List<Address> Get()
        {
            List<Address> addressList = new List<Address>();

            _dataProvider.ExecuteCmd("dbo.Addresses_SelectAll", inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                Address model = AddressMapper(reader);
                addressList.Add(model);
            });

            return addressList;
        }

        public List<StateId> GetStates()
        {
            List<StateId> list = null;
            _dataProvider.ExecuteCmd("dbo.StatesProvinces_SelectAll", inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                StateId model = new StateId();
                int startingIndex = 0;
                model.Id = reader.GetSafeInt32(startingIndex++);
                model.StateCode = reader.GetSafeString(startingIndex++);

                if (list == null)
                {
                    list = new List<StateId>();
                }
                list.Add(model);
            });
            return list;
        }

       
    }
}
