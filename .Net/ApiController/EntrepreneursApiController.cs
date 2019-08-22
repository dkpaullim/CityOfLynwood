using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Entrepreneurs;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/entrepreneurs")]
    [ApiController]
    public class EntrepreneursApiController : BaseApiController
    {
        private IEntrepreneursService _entrepreneursService;
        private IAuthenticationService<int> _authService;

        public EntrepreneursApiController(IAuthenticationService<int> authService,
            IEntrepreneursService entrepreneursService, ILogger<EntrepreneursApiController> logger) : base(logger)
        {
            _entrepreneursService = entrepreneursService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Insert(EntrepreneursAddRequest model)
        {
            try
            {
                int id = _entrepreneursService.Insert(model, _authService.GetCurrentUserId());
                ItemResponse<int> resp = new ItemResponse<int>();
                resp.Item = id;

                return Created201(resp);
            }
            catch (System.Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(int id, EntrepreneursUpdateRequest model)
        {
            try
            {
                if (id == model.Id)
                {
                    _entrepreneursService.Update(model, _authService.GetCurrentUserId());
                    SuccessResponse resp = new SuccessResponse();
                    return Ok200(resp);
                }
                else
                {
                    return StatusCode(400, new ErrorResponse("Bad Request: Body Id does not match Entity"));
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Entrepreneur>> GetById(int id)
        {
            try
            {
                Entrepreneur entrepreneur = _entrepreneursService.GetById(id);

                if (entrepreneur == null)
                {
                    return StatusCode(404, new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Entrepreneur> response = new ItemResponse<Entrepreneur>();
                    response.Item = entrepreneur;
                    return Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Entrepreneur>> GetAll()
        {
            try
            {
                List<Entrepreneur> entrepreneursList = _entrepreneursService.GetAll();

                if (entrepreneursList == null)
                {
                    return StatusCode(404, new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemsResponse<Entrepreneur> response = new ItemsResponse<Entrepreneur>();
                    response.Items = entrepreneursList;
                    return Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }


        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            try
            {
                _entrepreneursService.Delete(id);
                SuccessResponse response = new SuccessResponse();
                return Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Entrepreneur>>> GetPaged(int pageIndex, int pageSize)
        {
            try
            {
                Paged<Entrepreneur> pagedList = null;
                pagedList = _entrepreneursService.GetAllByPagination(pageIndex, pageSize);

                if (pagedList == null)
                {
                    return StatusCode(404, new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Entrepreneur>> response = new ItemResponse<Paged<Entrepreneur>>();
                    response.Item = pagedList;
                    return Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Entrepreneur>>> GetSearch(int pageIndex, int pageSize, string query)
        {
            try
            {
                Paged<Entrepreneur> pagedList = null;
                pagedList = _entrepreneursService.SearchPagination(pageIndex, pageSize, query);

                if (pagedList == null)
                {
                    return StatusCode(404, new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Entrepreneur>> response = new ItemResponse<Paged<Entrepreneur>>();
                    response.Item = pagedList;
                    return Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                return StatusCode(500, new ErrorResponse(ex.Message));
            }
        }

        [HttpGet("all/options")]
        public ActionResult<ItemsResponse<EntrepreneursTypes>> GetAllOptions()
        {
            try
            {
                EntrepreneursTypes result = _entrepreneursService.GetAllOptions();
                if (result == null)
                {
                    return StatusCode(404, new ErrorResponse("Item Not Found"));
                }
                else
                {
                    ItemResponse<EntrepreneursTypes> resp = new ItemResponse<EntrepreneursTypes>();
                    resp.Item = result;
                    return Ok200(resp);
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
