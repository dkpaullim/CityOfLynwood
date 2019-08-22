using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Addresses;
using Sabio.Models.Users;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/addresses")]
    [ApiController]
    public class AddressApiController : BaseApiController
    {
        private IAddressService _addressService;
        private IAuthenticationService<int> _authService;

        public AddressApiController(IAuthenticationService<int> authService, IAddressService addressService, ILogger<AddressApiController> logger) : base(logger)
        {
            _addressService = addressService;
            _authService = authService;
        }


        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            try
            {
                _addressService.Delete(id);
                SuccessResponse resp = new SuccessResponse();
                return Ok200(resp);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));

            }
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(int id, AddressUpdateRequest model)
        {
            try
            {
                if (id == model.Id)
                {
                    _addressService.Update(model);
                    SuccessResponse resp = new SuccessResponse();
                    return Ok200(resp);
                }
                else
                {
                    return NotFound404(new ErrorResponse("Bad Request: Body Id does not match entity"));
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Insert(AddressAddRequest model)
        {
            try
            {
                int id = _addressService.Insert(model, _authService.GetCurrentUserId());
                ItemResponse<int> resp = new ItemResponse<int>();
                resp.Item = id;
                return Created201(resp);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Address>> GetById(int id)
        {
            try
            {
                Address address = _addressService.GetById(id);
                if (address == null)
                {
                    return NotFound404(new ErrorResponse("No item found"));
                }
                else
                {
                    ItemResponse<Address> resp = new ItemResponse<Address>();
                    resp.Item = address;
                    return Ok200(resp);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("resource/{id:int}"), AllowAnonymous]
        public ActionResult<ItemResponse<Address>> GetByResourceId(int id)
        {
            try
            {
                Address address = _addressService.GetByResourceId(id);
                if (address == null)
                {
                    return NotFound404(new ErrorResponse("No item found"));
                }
                else
                {
                    ItemResponse<Address> resp = new ItemResponse<Address>();
                    resp.Item = address;
                    return Ok200(resp);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }
        
        [HttpGet("business/{userId:int}")]
        public ActionResult<ItemResponse<Address>> GetByBusinessUserId(int userId)
        {
            try
            {
                Address address = _addressService.GetByBusinessUserId(userId);
                if (address == null)
                {
                    return NotFound404(new ErrorResponse("No item found"));
                }
                else
                {
                    ItemResponse<Address> resp = new ItemResponse<Address>();
                    resp.Item = address;
                    return Ok200(resp);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("business/{id:int}")]
        public ActionResult<ItemResponse<Address>> GetByBusinessId(int id)
        {
            try
            {
                Address address = _addressService.GetByBusinessId(id);
                if (address == null)
                {
                    return NotFound404(new ErrorResponse("No item found"));
                }
                else
                {
                    ItemResponse<Address> resp = new ItemResponse<Address>();
                    resp.Item = address;
                    return Ok200(resp);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Address>> SelectAll()
        {
            try
            {
                List<Address> addressList = _addressService.Get();
                if (addressList == null)
                {
                    return NotFound404(new ErrorResponse("No items found"));
                }
                else
                {
                    ItemsResponse<Address> resp = new ItemsResponse<Address>();
                    resp.Items = addressList;
                    return Ok200(resp);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("stateProvinces")]
        public ActionResult<ItemsResponse<StateId>> GetStates()
        {
            try
            {
                List<StateId> list = _addressService.GetStates();
                if (list == null)
                {
                    return StatusCode(404, new ErrorResponse("Item Not Found"));
                }
                else
                {
                    ItemsResponse<StateId> resp = new ItemsResponse<StateId>();
                    resp.Items = list;
                    return Ok200(resp);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpPost("geocode")]
        public async Task<ActionResult<ItemResponse<results>>> GoogleApi(AddressVerifyAddRequest model)
        {
            GeoCode geoCode = null;
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string newAddress = model.LineOne + model.LineTwo + model.City + model.StateCode;
                    string url = string.Format("https://maps.googleapis.com/maps/api/geocode/json?address={0}&key=AIzaSyCcNS3-tLcu_KvNF0goRSDMxHsacN0SLRE", newAddress);
                    HttpResponseMessage response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    string content = await response.Content.ReadAsStringAsync();
                    geoCode = JsonConvert.DeserializeObject<GeoCode>(content);
                }
                if(geoCode != null && geoCode.results.Length > 0)
                {
                    ItemResponse<results> response = new ItemResponse<results>();
                    response.Item = geoCode.results[0];
                    return Ok200(response);
                } else
                {
                    return NotFound404(new ErrorResponse("No Location was Found"));
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }

        }

       
    }
}