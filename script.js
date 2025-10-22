// Scroll to calculator
function scrollToCalculator() {
  document.getElementById("calculator").scrollIntoView({
    behavior: "smooth",
  })
}

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)
}

// Calculate future value with compound interest
function calculateFutureValue(monthlyPayment, months, annualRate) {
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) {
    return monthlyPayment * months
  }
  return (monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate
}

// Calculate monthly payment needed
function calculateMonthlyPayment(futureValue, months, annualRate) {
  const monthlyRate = annualRate / 12 / 100
  if (monthlyRate === 0) {
    return futureValue / months
  }
  return (futureValue * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
}

// Main calculation function
function calculate() {
  // Get input values
  const yearsWorking = Number.parseInt(document.getElementById("yearsWorking").value)
  const monthlyIncome = Number.parseFloat(document.getElementById("monthlyIncome").value)
  const retirementYears = Number.parseInt(document.getElementById("retirementYears").value)
  const interestRate = Number.parseFloat(document.getElementById("interestRate").value)

  // Calculate total needed
  const totalNeeded = monthlyIncome * 12 * retirementYears

  // Calculate monthly savings needed
  const monthsWorking = yearsWorking * 12
  const monthlySavings = calculateMonthlyPayment(totalNeeded, monthsWorking, interestRate)

  // Calculate total invested and interest earned
  const totalInvested = monthlySavings * monthsWorking
  const totalInterest = totalNeeded - totalInvested

  // Update results
  document.getElementById("totalNeeded").textContent = formatCurrency(totalNeeded)
  document.getElementById("monthlySavings").textContent = formatCurrency(monthlySavings)
  document.getElementById("totalInvested").textContent = formatCurrency(totalInvested)
  document.getElementById("totalInterest").textContent = formatCurrency(totalInterest)

  // Draw chart
  drawChart(monthlySavings, monthsWorking, interestRate)

  // Show comparison
  showComparison(totalNeeded, monthsWorking)
}

// Draw savings progression chart
function drawChart(monthlyPayment, months, annualRate) {
  const canvas = document.getElementById("savingsChart")
  const ctx = canvas.getContext("2d")

  // Set canvas size
  canvas.width = canvas.offsetWidth
  canvas.height = 200

  const width = canvas.width
  const height = canvas.height
  const padding = 40

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Calculate data points
  const dataPoints = []
  const monthlyRate = annualRate / 12 / 100
  let accumulated = 0

  for (let i = 0; i <= months; i++) {
    if (i > 0) {
      accumulated = accumulated * (1 + monthlyRate) + monthlyPayment
    }
    dataPoints.push(accumulated)
  }

  const maxValue = Math.max(...dataPoints)

  // Draw grid lines
  ctx.strokeStyle = "#e2ddd5"
  ctx.lineWidth = 1

  for (let i = 0; i <= 4; i++) {
    const y = padding + ((height - 2 * padding) * i) / 4
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // Draw line chart
  ctx.strokeStyle = "#10b981"
  ctx.lineWidth = 3
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  ctx.beginPath()

  dataPoints.forEach((value, index) => {
    const x = padding + ((width - 2 * padding) * index) / (dataPoints.length - 1)
    const y = height - padding - ((height - 2 * padding) * value) / maxValue

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Draw gradient fill
  const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
  gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)")
  gradient.addColorStop(1, "rgba(16, 185, 129, 0)")

  ctx.lineTo(width - padding, height - padding)
  ctx.lineTo(padding, height - padding)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()

  // Draw labels
  ctx.fillStyle = "#64748b"
  ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif"
  ctx.textAlign = "left"
  ctx.fillText("0 anos", padding, height - padding + 20)
  ctx.textAlign = "right"
  ctx.fillText(`${Math.floor(months / 12)} anos`, width - padding, height - padding + 20)
  ctx.textAlign = "right"
  ctx.fillText(formatCurrency(maxValue), width - padding, padding - 10)
}

// Show investment comparison
function showComparison(totalNeeded, months) {
  const investments = [
    { name: "Poupança", rate: 3.5 },
    { name: "CDB", rate: 6.0 },
    { name: "Tesouro Direto", rate: 8.0 },
    { name: "Fundos Imobiliários", rate: 10.0 },
  ]

  const comparisonGrid = document.getElementById("comparisonGrid")
  comparisonGrid.innerHTML = ""

  investments.forEach((investment) => {
    const monthlyPayment = calculateMonthlyPayment(totalNeeded, months, investment.rate)

    const item = document.createElement("div")
    item.className = "comparison-item"
    item.innerHTML = `
            <div>
                <div class="comparison-name">${investment.name}</div>
                <div class="comparison-rate">${investment.rate}% ao ano</div>
            </div>
            <div class="comparison-value">${formatCurrency(monthlyPayment)}/mês</div>
        `

    comparisonGrid.appendChild(item)
  })
}

// Calculate on page load
window.addEventListener("load", () => {
  calculate()

  // Add event listeners to inputs
  const inputs = ["yearsWorking", "monthlyIncome", "retirementYears", "interestRate"]
  inputs.forEach((id) => {
    document.getElementById(id).addEventListener("input", calculate)
  })
})
