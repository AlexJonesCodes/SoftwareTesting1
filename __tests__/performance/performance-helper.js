const generateSignupData = (requestParams, ctx, ee, next) => {
  ctx.vars["name"] = "Test PerformanceUser";
  const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  ctx.vars["email"] = `testperformanceuser_${uniqueSuffix}@test.com`;
  ctx.vars["password"] = "12345";
  ctx.vars["address"] = "Somewhere X";
  ctx.vars["role"] = "Admin";

  return next();
}

const generateLoginData = (requestParams, ctx, ee, next) => {
  if (!ctx.vars["email"]) {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    ctx.vars["email"] = `testperformanceuser_${uniqueSuffix}@test.com`;
  }
  ctx.vars["password"] = "12345";

  return next();
}

const generateOrderData = (requestParams, ctx, ee, next) => {
  ctx.vars["type"] = "Box1";
  ctx.vars["description"] = "{Test Order - Performance}";

  return next();
}

const generateUpdatedOrderData = (requestParams, ctx, ee, next) => {
  ctx.vars["type"] = "Box1";
  ctx.vars["description"] = "{Test Order - Updated}";

  return next();
}
  
module.exports = {
  generateSignupData,
  generateLoginData,
  generateOrderData,
  generateUpdatedOrderData
};
